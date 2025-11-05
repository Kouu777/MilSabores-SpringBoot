package com.milsabores.backend.controller;

import com.milsabores.backend.dtos.AuthResponse;
import com.milsabores.backend.dtos.LoginRequest;
import com.milsabores.backend.dtos.RegisterRequest;
import com.milsabores.backend.model.Usuario;
import com.milsabores.backend.repository.UsuarioRepository;
import com.milsabores.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);
            
            Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // No enviar la contraseña en la respuesta
            usuario.setPassword(null);
            
            return ResponseEntity.ok(new AuthResponse(jwt, usuario));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciales inválidas: " + e.getMessage());
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Verificar si el email ya existe
            if (usuarioRepository.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest().body("El email ya está registrado");
            }

            // Crear nuevo usuario
            Usuario usuario = new Usuario();
            usuario.setNombre(registerRequest.getNombre());
            usuario.setApellido(registerRequest.getApellido());
            usuario.setEmail(registerRequest.getEmail());
            usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            usuario.setEsActivo(true);

            Usuario savedUsuario = usuarioRepository.save(usuario);

            // Autenticar automáticamente después del registro
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    registerRequest.getEmail(),
                    registerRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            // No enviar la contraseña en la respuesta
            savedUsuario.setPassword(null);

            return ResponseEntity.ok(new AuthResponse(jwt, savedUsuario));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en el registro: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // En una aplicación stateless con JWT, el logout se maneja en el cliente
        // eliminando el token
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout exitoso");
    }

   
    @GetMapping("/me") 
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("No autenticado");
            }

            String email = authentication.getName();
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Calcular edad si no está calculada
            if (usuario.getFechaNacimiento() != null && usuario.getEdad() == null) {
                usuario.setEdad(calcularEdad(usuario.getFechaNacimiento()));
                usuarioRepository.save(usuario);
            }
            
            // Calcular si es Duoc si no está establecido
            if (usuario.getIsDuoc() == null && usuario.getEmail() != null) {
                usuario.setIsDuoc(usuario.getEmail().toLowerCase().endsWith("@duocuc.cl"));
                usuarioRepository.save(usuario);
            }

            usuario.setPassword(null);
            return ResponseEntity.ok(usuario);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error obteniendo usuario: " + e.getMessage());
        }
    }

    private Integer calcularEdad(String fechaNacimiento) {
        try {
            java.time.LocalDate nacimiento = java.time.LocalDate.parse(fechaNacimiento);
            java.time.LocalDate hoy = java.time.LocalDate.now();
            return java.time.Period.between(nacimiento, hoy).getYears();
        } catch (Exception e) {
            return null;
        }
    }
}
