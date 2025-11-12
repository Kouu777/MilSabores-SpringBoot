package com.milsabores.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milsabores.backend.model.Producto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ProductoRespository extends JpaRepository<Producto, Long>{
    
    // Buscar por categoría (String - para compatibilidad con búsquedas por nombre de categoría)
    List<Producto> findByCategoria(String categoria);
    
    // Buscar productos activos
    List<Producto> findByEsActivoTrue();
    
    // Buscar por categoría y activos (String)
    List<Producto> findByCategoriaAndEsActivoTrue(String categoria);
    
    // Buscar por nombre (contiene)
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    
    // Buscar por rango de precios
    List<Producto> findByPrecioBetween(Double precioMin, Double precioMax);
    
    // Buscar por categoría y rango de precios
    List<Producto> findByCategoriaAndPrecioBetween(String categoria, Double precioMin, Double precioMax);
    
    // Consulta personalizada con JPQL
    @Query("SELECT p FROM Producto p WHERE p.stock > 0 AND p.esActivo = true")
    List<Producto> findProductosDisponibles();
    
    // Consulta con parámetros nombrados
    @Query("SELECT p FROM Producto p WHERE p.precio < :precioMax AND p.categoria = :categoria")
    List<Producto> findProductosBaratosPorCategoria(
        @Param("precioMax") Double precioMax, 
        @Param("categoria") String categoria
    );
    
    // Contar productos por categoría
    @Query("SELECT p.categoria, COUNT(p) FROM Producto p GROUP BY p.categoria")
    List<Object[]> countProductosPorCategoria();
    
    // Buscar productos con stock bajo
    @Query("SELECT p FROM Producto p WHERE p.stock < :stockMinimo AND p.stock > 0")
    List<Producto> findProductosConStockBajo(@Param("stockMinimo") Integer stockMinimo);
}
