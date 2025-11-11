package com.milsabores.backend.controller;

import com.milsabores.backend.model.Categoria;
import com.milsabores.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})

public class CategoriaController {
    
    @Autowired
    private CategoriaRepository categoriaRepository;

    // GET: Todas las categorías activas
    @GetMapping
    public List<Categoria> getAllCategorias() {
        // Primero intenta obtener categorías activas ordenadas
        List<Categoria> categorias = categoriaRepository.findByEsActivaTrueOrderByOrdenAsc();
        
        // Si no hay categorías activas, devuelve todas
        if (categorias.isEmpty()) {
            categorias = categoriaRepository.findAll();
        }
        
        return categorias;
    }

    // GET: Categoría por ID
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long id) {
        Optional<Categoria> categoria = categoriaRepository.findById(id);
        return categoria.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // GET: Categorías principales
    @GetMapping("/principales")
    public List<Categoria> getCategoriasPrincipales() {
        return categoriaRepository.findByCategoriaPadreIsNull();
    }

    // GET: Subcategorías
    @GetMapping("/{id}/subcategorias")
    public List<Categoria> getSubcategorias(@PathVariable Long id) {
        return categoriaRepository.findByCategoriaPadreId(id);
    }

    // POST: Crear categoría
    @PostMapping
    public Categoria createCategoria(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    // PUT: Actualizar categoría
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(
            @PathVariable Long id, 
            @RequestBody Categoria categoriaDetails) {
        
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        
        if (categoriaOptional.isPresent()) {
            Categoria categoria = categoriaOptional.get();
            
            categoria.setNombre(categoriaDetails.getNombre());
            categoria.setDescripcion(categoriaDetails.getDescripcion());
            categoria.setImagenUrl(categoriaDetails.getImagenUrl());
            categoria.setColor(categoriaDetails.getColor());
            categoria.setOrden(categoriaDetails.getOrden());
            categoria.setEsActiva(categoriaDetails.getEsActiva());
            categoria.setCategoriaPadre(categoriaDetails.getCategoriaPadre());
            
            Categoria updatedCategoria = categoriaRepository.save(categoria);
            return ResponseEntity.ok(updatedCategoria);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Eliminar categoría (lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategoria(@PathVariable Long id) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        
        if (categoriaOptional.isPresent()) {
            Categoria categoria = categoriaOptional.get();
            categoria.setEsActiva(false);
            categoriaRepository.save(categoria);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
