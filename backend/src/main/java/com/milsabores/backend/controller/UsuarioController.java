package com.milsabores.backend.controller;

import com.milsabores.backend.model.Usuario;
import com.milsabores.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
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

    // Actualizar perfil del usuario autenticado
    @PutMapping("/perfil")
    public ResponseEntity<?> updateProfile(@RequestBody UserUpdateRequest userData, Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("No autenticado");
            }

            String email = authentication.getName();
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Actualizar campos básicos
            if (userData.getNombre() != null) usuario.setNombre(userData.getNombre());
            if (userData.getApellido() != null) usuario.setApellido(userData.getApellido());
            
            // Actualizar campos personalizados
            if (userData.getFechaNacimiento() != null) {
                usuario.setFechaNacimiento(userData.getFechaNacimiento());
                // Calcular edad automáticamente
                usuario.setEdad(calcularEdad(userData.getFechaNacimiento()));
            }
            if (userData.getPreferencias() != null) usuario.setPreferencias(userData.getPreferencias());
            
            // Actualizar password si se proporciona
            if (userData.getPassword() != null && !userData.getPassword().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(userData.getPassword()));
            }
            
            // Calcular si es Duoc
            if (usuario.getEmail() != null) {
                usuario.setIsDuoc(usuario.getEmail().toLowerCase().endsWith("@duocuc.cl"));
            }

            Usuario updatedUsuario = usuarioRepository.save(usuario);
            updatedUsuario.setPassword(null); 

            return ResponseEntity.ok(updatedUsuario);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error actualizando perfil: " + e.getMessage());
        }
    }

    private Integer calcularEdad(String fechaNacimiento) {
        try {
            LocalDate nacimiento = LocalDate.parse(fechaNacimiento);
            LocalDate hoy = LocalDate.now();
            return Period.between(nacimiento, hoy).getYears();
        } catch (Exception e) {
            return null;
        }
    }

    // GET: Todos los usuarios activos
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findByEsActivoTrue();
    }

    // GET: Usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // POST: Crear usuario (registro)
    @PostMapping("/registro")
    public ResponseEntity<?> createUsuario(@RequestBody Usuario usuario) {
        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }
        
        Usuario savedUsuario = usuarioRepository.save(usuario);
        return ResponseEntity.ok(savedUsuario);
    }

    // POST: Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuario = usuarioRepository.findByEmailAndPassword(
            loginRequest.getEmail(), 
            loginRequest.getPassword()
        );
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    // PUT: Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(
            @PathVariable Long id, 
            @RequestBody Usuario usuarioDetails) {
        
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            
            usuario.setNombre(usuarioDetails.getNombre());
            usuario.setApellido(usuarioDetails.getApellido());
            
            Usuario updatedUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(updatedUsuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Eliminar usuario (lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            usuario.setEsActivo(false);
            usuarioRepository.save(usuario);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ← NUEVA CLASE: DTO para actualización de perfil
    public static class UserUpdateRequest {
        private String nombre;
        private String apellido;
        private String fechaNacimiento;
        private String preferencias;
        private String password;

        // Getters y setters
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getApellido() { return apellido; }
        public void setApellido(String apellido) { this.apellido = apellido; }
        public String getFechaNacimiento() { return fechaNacimiento; }
        public void setFechaNacimiento(String fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
        public String getPreferencias() { return preferencias; }
        public void setPreferencias(String preferencias) { this.preferencias = preferencias; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // Clase interna para login request
    public static class LoginRequest {
        private String email;
        private String password;
        
        // Getters y setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}