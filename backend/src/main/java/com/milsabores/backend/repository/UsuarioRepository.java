package com.milsabores.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milsabores.backend.model.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
      // Buscar por email
      Optional<Usuario> findByEmail(String email);
    
      // Verificar si existe un usuario con ese email
      boolean existsByEmail(String email);
      
      // Buscar por rol
      List<Usuario> findByRol(Usuario.RolUsuario rol);
      
      // Buscar usuarios activos
      List<Usuario> findByEsActivoTrue();
      
      // Buscar por nombre o apellido
      List<Usuario> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);
      
      // Consulta para login
      @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.password = :password AND u.esActivo = true")
      Optional<Usuario> findByEmailAndPassword(@Param("email") String email, @Param("password") String password);
      
      // Contar usuarios por rol
      @Query("SELECT u.rol, COUNT(u) FROM Usuario u GROUP BY u.rol")
      List<Object[]> countUsuariosPorRol();
}
