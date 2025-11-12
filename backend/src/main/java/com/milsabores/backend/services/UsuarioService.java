package com.milsabores.backend.services;

import com.milsabores.backend.dtos.ChangePasswordRequest;
import com.milsabores.backend.dtos.PerfilDTO;
import com.milsabores.backend.model.Usuario;
import com.milsabores.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Obtiene el usuario autenticado actualmente
     */
    public Usuario getUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
            return usuario.orElse(null);
        }
        return null;
    }

    /**
     * Obtiene el perfil del usuario autenticado
     */
    public PerfilDTO obtenerPerfil() {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario != null) {
            return convertirAPerfilDTO(usuario);
        }
        return null;
    }

    /**
     * Actualiza el perfil del usuario autenticado
     */
    public PerfilDTO actualizarPerfil(PerfilDTO perfilDTO) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario != null) {
            // Actualizar campos permitidos (no email ni fechaRegistro)
            if (perfilDTO.getNombre() != null && !perfilDTO.getNombre().isBlank()) {
                usuario.setNombre(perfilDTO.getNombre());
            }
            if (perfilDTO.getApellido() != null && !perfilDTO.getApellido().isBlank()) {
                usuario.setApellido(perfilDTO.getApellido());
            }
            if (perfilDTO.getFechaNacimiento() != null) {
                usuario.setFechaNacimiento(perfilDTO.getFechaNacimiento());
            }
            if (perfilDTO.getEdad() != null) {
                usuario.setEdad(perfilDTO.getEdad());
            }
            if (perfilDTO.getIsDuoc() != null) {
                usuario.setIsDuoc(perfilDTO.getIsDuoc());
            }
            if (perfilDTO.getHasFelices50() != null) {
                usuario.setHasFelices50(perfilDTO.getHasFelices50());
            }
            if (perfilDTO.getPreferencias() != null) {
                usuario.setPreferencias(perfilDTO.getPreferencias());
            }

            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            return convertirAPerfilDTO(usuarioActualizado);
        }
        return null;
    }

    /**
     * Cambia la contraseña del usuario autenticado
     */
    public boolean cambiarContrasena(ChangePasswordRequest request) {
        Usuario usuario = getUsuarioAutenticado();
        if (usuario != null) {
            // Validar que la contraseña actual sea correcta
            if (passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
                // Validar que la nueva contraseña no sea vacía
                if (request.getPasswordNuevo() != null && !request.getPasswordNuevo().isBlank()) {
                    usuario.setPassword(passwordEncoder.encode(request.getPasswordNuevo()));
                    usuarioRepository.save(usuario);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Convierte una entidad Usuario a PerfilDTO
     */
    private PerfilDTO convertirAPerfilDTO(Usuario usuario) {
        PerfilDTO dto = new PerfilDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setFechaNacimiento(usuario.getFechaNacimiento());
        dto.setEdad(usuario.getEdad());
        dto.setIsDuoc(usuario.getIsDuoc());
        dto.setHasFelices50(usuario.getHasFelices50());
        dto.setPreferencias(usuario.getPreferencias());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        return dto;
    }
}
