// Este archivo muestra EJEMPLO de cómo implementar Perfil de Usuario
// Cópialo en: backend/src/main/java/com/milsabores/backend/controller/UsuarioController.java
// Actualiza el archivo existente con estos métodos nuevos

package com.milsabores.backend.controller;

import com.milsabores.backend.model.Usuario;
import com.milsabores.backend.dtos.UserUpdateRequest;
import com.milsabores.backend.dtos.PerfilDTO;
import com.milsabores.backend.dtos.ChangePasswordRequest;
import com.milsabores.backend.repository.UsuarioRepository;
import com.milsabores.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ============ ENDPOINTS EXISTENTES ============

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, 
                                               @RequestBody UserUpdateRequest userUpdateRequest) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            
            if (userUpdateRequest.getNombre() != null) {
                usuario.setNombre(userUpdateRequest.getNombre());
            }
            if (userUpdateRequest.getEmail() != null) {
                usuario.setEmail(userUpdateRequest.getEmail());
            }
            if (userUpdateRequest.getPassword() != null) {
                usuario.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
            }
            
            Usuario updatedUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(updatedUsuario);
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        
        if (usuarioOptional.isPresent()) {
            usuarioRepository.delete(usuarioOptional.get());
            return ResponseEntity.ok().build();
        }
        
        return ResponseEntity.notFound().build();
    }

    // ============ NUEVOS ENDPOINTS PARA PERFIL ============

    /**
     * GET /api/usuarios/perfil
     * Obtener perfil del usuario autenticado (desde el JWT token)
     */
    @GetMapping("/perfil")
    public ResponseEntity<PerfilDTO> getPerfil(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName(); // El nombre del principal es el email
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            PerfilDTO perfilDTO = new PerfilDTO(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getDireccion(),
                usuario.getFechaCreacion()
            );
            return ResponseEntity.ok(perfilDTO);
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * PUT /api/usuarios/perfil
     * Actualizar perfil del usuario autenticado
     */
    @PutMapping("/perfil")
    public ResponseEntity<PerfilDTO> actualizarPerfil(
            @RequestBody PerfilDTO perfilDTO,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            // Actualizar solo los campos que vienen en el DTO
            if (perfilDTO.getNombre() != null && !perfilDTO.getNombre().isEmpty()) {
                usuario.setNombre(perfilDTO.getNombre());
            }
            if (perfilDTO.getTelefono() != null && !perfilDTO.getTelefono().isEmpty()) {
                usuario.setTelefono(perfilDTO.getTelefono());
            }
            if (perfilDTO.getDireccion() != null && !perfilDTO.getDireccion().isEmpty()) {
                usuario.setDireccion(perfilDTO.getDireccion());
            }
            // NOTA: No permitimos cambiar email por PUT /perfil, usar endpoint dedicado

            Usuario usuarioActualizado = usuarioRepository.save(usuario);

            PerfilDTO perfilActualizado = new PerfilDTO(
                usuarioActualizado.getId(),
                usuarioActualizado.getNombre(),
                usuarioActualizado.getEmail(),
                usuarioActualizado.getTelefono(),
                usuarioActualizado.getDireccion(),
                usuarioActualizado.getFechaCreacion()
            );

            return ResponseEntity.ok(perfilActualizado);
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * PATCH /api/usuarios/perfil/password
     * Cambiar contraseña del usuario autenticado
     */
    @PatchMapping("/perfil/password")
    public ResponseEntity<?> cambiarContrasena(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        // Validar que las contraseñas nuevas coincidan
        if (!request.getPasswordNuevo().equals(request.getPasswordConfirmar())) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Las contraseñas no coinciden"));
        }

        // Validar longitud mínima
        if (request.getPasswordNuevo().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("La contraseña debe tener al menos 6 caracteres"));
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();

            // Verificar que la contraseña actual sea correcta
            if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new ErrorResponse("La contraseña actual es incorrecta"));
            }

            // Cambiar la contraseña
            usuario.setPassword(passwordEncoder.encode(request.getPasswordNuevo()));
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(new SuccessResponse("Contraseña actualizada correctamente"));
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * PUT /api/usuarios/perfil/email
     * Cambiar email del usuario autenticado (opcional)
     */
    @PutMapping("/perfil/email")
    public ResponseEntity<?> cambiarEmail(
            @RequestParam String emailNuevo,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        // Validar que el email no esté en uso
        if (usuarioRepository.findByEmail(emailNuevo).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("El email ya está registrado"));
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            usuario.setEmail(emailNuevo);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(new SuccessResponse("Email actualizado correctamente"));
        }

        return ResponseEntity.notFound().build();
    }

    // ============ CLASES INTERNAS PARA RESPUESTAS ============

    /**
     * Clase para respuestas de error
     */
    public static class ErrorResponse {
        private String mensaje;

        public ErrorResponse(String mensaje) {
            this.mensaje = mensaje;
        }

        public String getMensaje() {
            return mensaje;
        }

        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }
    }

    /**
     * Clase para respuestas de éxito
     */
    public static class SuccessResponse {
        private String mensaje;

        public SuccessResponse(String mensaje) {
            this.mensaje = mensaje;
        }

        public String getMensaje() {
            return mensaje;
        }

        public void setMensaje(String mensaje) {
            this.mensaje = mensaje;
        }
    }
}
