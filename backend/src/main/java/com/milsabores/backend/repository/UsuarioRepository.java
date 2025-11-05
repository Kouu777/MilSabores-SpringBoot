package com.milsabores.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milsabores.backend.model.Usuario;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
      
      Optional<Usuario> findByEmail(String email);
      boolean existsByEmail(String email);
      List<Usuario> findByEsActivoTrue();

      // Contar usuarios por rol
      @Query("SELECT u.rol, COUNT(u) FROM Usuario u GROUP BY u.rol")
      List<Object[]> countUsuariosPorRol();
}
