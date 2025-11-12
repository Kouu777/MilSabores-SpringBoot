package com.milsabores.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.milsabores.backend.dtos.ChangePasswordRequest;
import com.milsabores.backend.dtos.PerfilDTO;
import com.milsabores.backend.model.Usuario;
import com.milsabores.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para UsuarioController (endpoints de Perfil)
 * Verifica: GET perfil, PUT actualizar perfil, PATCH cambiar contraseña
 */
@SpringBootTest
@AutoConfigureMockMvc
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private Usuario usuarioTest;
    private String tokenTest; // Simulamos autenticación con Authorization header

    @BeforeEach
    void setup() {
        // Limpiar BD de test
        usuarioRepository.deleteAll();

        // Crear un usuario de prueba
        usuarioTest = new Usuario();
        usuarioTest.setNombre("Juan");
        usuarioTest.setApellido("Pérez");
        usuarioTest.setEmail("juan@example.com");
        usuarioTest.setPassword(passwordEncoder.encode("password123"));
        usuarioTest.setFechaNacimiento("1995-05-15");
        usuarioTest.setEdad(29);
        usuarioTest.setIsDuoc(true);
        usuarioTest.setHasFelices50(false);
        usuarioTest.setPreferencias("Repostería artesanal");
        usuarioTest.setEsActivo(true);
        usuarioTest.setFechaRegistro(LocalDateTime.now());

        usuarioRepository.save(usuarioTest);
    }

    /**
     * Test: GET /api/usuarios/perfil
     * Verifica que un usuario autenticado puede obtener su perfil
     */
    @Test
    void testGetPerfilAutenticado() throws Exception {
        mockMvc.perform(get("/api/usuarios/perfil")
                .header("Authorization", "Bearer token_dummy") // Simulamos token
                .with(request -> {
                    // Inyectamos el email en el Authentication (simulando JWT)
                    request.setUserPrincipal(() -> "juan@example.com");
                    return request;
                }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nombre").value("Juan"))
                .andExpect(jsonPath("$.apellido").value("Pérez"))
                .andExpect(jsonPath("$.email").value("juan@example.com"))
                .andExpect(jsonPath("$.edad").value(29))
                .andExpect(jsonPath("$.isDuoc").value(true))
                .andExpect(jsonPath("$.preferencias").value("Repostería artesanal"));
    }

    /**
     * Test: GET /api/usuarios/perfil sin autenticación
     * Verifica que devuelve 401 Unauthorized
     */
    @Test
    void testGetPerfilNoAutenticado() throws Exception {
        mockMvc.perform(get("/api/usuarios/perfil"))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Test: PUT /api/usuarios/perfil
     * Verifica que el usuario puede actualizar su perfil
     */
    @Test
    void testActualizarPerfilAutenticado() throws Exception {
        PerfilDTO perfilActualizado = new PerfilDTO();
        perfilActualizado.setNombre("Juan Carlos");
        perfilActualizado.setApellido("Pérez García");
        perfilActualizado.setFechaNacimiento("1995-05-16");
        perfilActualizado.setEdad(30);
        perfilActualizado.setIsDuoc(false);
        perfilActualizado.setHasFelices50(true);
        perfilActualizado.setPreferencias("Pasteles y tartas");

        mockMvc.perform(put("/api/usuarios/perfil")
                .with(request -> {
                    request.setUserPrincipal(() -> "juan@example.com");
                    return request;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(perfilActualizado)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan Carlos"))
                .andExpect(jsonPath("$.apellido").value("Pérez García"))
                .andExpect(jsonPath("$.edad").value(30))
                .andExpect(jsonPath("$.hasFelices50").value(true))
                .andExpect(jsonPath("$.preferencias").value("Pasteles y tartas"));
    }

    /**
     * Test: PATCH /api/usuarios/perfil/password
     * Verifica cambio de contraseña con validaciones
     */
    @Test
    void testCambiarContrasenaExito() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setPasswordActual("password123");
        request.setPasswordNuevo("newPassword456");
        request.setPasswordConfirmar("newPassword456");

        mockMvc.perform(patch("/api/usuarios/perfil/password")
                .with(req -> {
                    req.setUserPrincipal(() -> "juan@example.com");
                    return req;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value(containsString("actualizada")));
    }

    /**
     * Test: PATCH /api/usuarios/perfil/password con contraseña actual incorrecta
     * Verifica que rechaza contraseña incorrecta
     */
    @Test
    void testCambiarContrasenaIncorrectaActual() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setPasswordActual("wrongPassword");
        request.setPasswordNuevo("newPassword456");
        request.setPasswordConfirmar("newPassword456");

        mockMvc.perform(patch("/api/usuarios/perfil/password")
                .with(req -> {
                    req.setUserPrincipal(() -> "juan@example.com");
                    return req;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value(containsString("incorrecta")));
    }

    /**
     * Test: PATCH /api/usuarios/perfil/password con contraseñas nuevas no coincidentes
     * Verifica validación de confirmación de contraseña
     */
    @Test
    void testCambiarContrasenaNoCoinciden() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setPasswordActual("password123");
        request.setPasswordNuevo("newPassword456");
        request.setPasswordConfirmar("differentPassword789");

        mockMvc.perform(patch("/api/usuarios/perfil/password")
                .with(req -> {
                    req.setUserPrincipal(() -> "juan@example.com");
                    return req;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value(containsString("coinciden")));
    }

    /**
     * Test: PATCH /api/usuarios/perfil/password con contraseña muy corta
     * Verifica requisito mínimo de longitud
     */
    @Test
    void testCambiarContrasenaCorta() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setPasswordActual("password123");
        request.setPasswordNuevo("12345"); // Menos de 6 caracteres
        request.setPasswordConfirmar("12345");

        mockMvc.perform(patch("/api/usuarios/perfil/password")
                .with(req -> {
                    req.setUserPrincipal(() -> "juan@example.com");
                    return req;
                })
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value(containsString("al menos 6")));
    }

    /**
     * Test: PUT /api/usuarios/perfil/email
     * Verifica cambio de email del usuario autenticado
     */
    @Test
    void testCambiarEmailExito() throws Exception {
        mockMvc.perform(put("/api/usuarios/perfil/email")
                .with(req -> {
                    req.setUserPrincipal(() -> "juan@example.com");
                    return req;
                })
                .param("emailNuevo", "juannuevo@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensaje").value(containsString("actualizado")));
    }

    /**
     * Test: PUT /api/usuarios/perfil/email con email duplicado
     * Verifica que rechaza email ya registrado
     */
    @Test
    void testCambiarEmailDuplicado() throws Exception {
        // Crear otro usuario con un email diferente
        Usuario otroUsuario = new Usuario();
        otroUsuario.setNombre("Carlos");
        otroUsuario.setApellido("García");
        otroUsuario.setEmail("carlos@example.com");
        otroUsuario.setPassword(passwordEncoder.encode("pass123"));
        otroUsuario.setEsActivo(true);
        usuarioRepository.save(otroUsuario);

        // Intentar cambiar email de juanTest al de Carlos
        mockMvc.perform(put("/api/usuarios/perfil/email")
                .with(req -> {
                    req.setUserPrincipal(() -> "juan@example.com");
                    return req;
                })
                .param("emailNuevo", "carlos@example.com"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value(containsString("ya está registrado")));
    }
}
