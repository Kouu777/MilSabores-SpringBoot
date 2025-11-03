package com.milsabores.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milsabores.backend.model.Categoria;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long>{
     // Buscar por nombre exacto
     Optional<Categoria> findByNombre(String nombre);
    
     // Buscar categorías activas
     List<Categoria> findByEsActivaTrue();
     
     // Buscar categorías principales (sin padre)
     List<Categoria> findByCategoriaPadreIsNull();
     
     // Buscar subcategorías de una categoría padre
     List<Categoria> findByCategoriaPadreId(Long padreId);
     
     // Buscar por nombre (contiene)
     List<Categoria> findByNombreContainingIgnoreCase(String nombre);
     
     // Ordenar por orden ascendente
     List<Categoria> findByEsActivaTrueOrderByOrdenAsc();
     
     // Consulta personalizada para categorías con productos
     @Query("SELECT DISTINCT c FROM Categoria c JOIN c.productos p WHERE p.esActivo = true")
     List<Categoria> findCategoriasConProductosActivos();
     
     // Contar productos por categoría
     @Query("SELECT c.nombre, COUNT(p) FROM Categoria c LEFT JOIN c.productos p GROUP BY c.id, c.nombre")
     List<Object[]> contarProductosPorCategoria();
}
