package com.milsabores.backend.controller;

import com.milsabores.backend.model.Producto;
import com.milsabores.backend.model.Categoria;
import com.milsabores.backend.repository.ProductoRespository;
import com.milsabores.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProductoController {
    
    @Autowired
    private ProductoRespository productoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;

    // GET: Todos los productos
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    // GET: Buscar productos por nombre
    @GetMapping("/buscar")
    public List<Producto> buscarProductos(@RequestParam String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // GET: Productos por rango de precio
    @GetMapping("/rango-precio")
    public List<Producto> getProductosPorRangoPrecio(
            @RequestParam Double min, 
            @RequestParam Double max) {
        return productoRepository.findByPrecioBetween(min, max);
    }

    // GET: Obtener productos por categoría (por ID numérico)
    // Ejemplo: GET /api/productos/categoria/1 
    // Busca la categoría con ID=1, obtiene su nombre, y devuelve productos con ese nombre de categoría
    @GetMapping("/categoria/{categoriaId}") 
    public List<Producto> getProductosByCategoriaId(@PathVariable Long categoriaId) {
        // Buscar la categoría por ID
        Optional<Categoria> categoriaOpt = categoriaRepository.findById(categoriaId);
        
        if (categoriaOpt.isPresent()) {
            // Obtener el nombre de la categoría
            String nombreCategoria = categoriaOpt.get().getNombre();
            // Buscar productos activos con ese nombre de categoría
            return productoRepository.findByCategoriaAndEsActivoTrue(nombreCategoria);
        }
        
        // Si no existe la categoría, devolver lista vacía
        return List.of();
    }

    // GET: Obtener productos por categoría (nombre como string)
    @GetMapping("/buscar/categoria")
    public List<Producto> getProductosByCategoriaNombre(@RequestParam String categoria) {
        return productoRepository.findByCategoriaAndEsActivoTrue(categoria);
    }

    // GET: Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Optional<Producto> producto = productoRepository.findById(id);
        return producto.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // POST: Crear nuevo producto
    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    // PUT: Actualizar producto existente
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(
            @PathVariable Long id, 
            @RequestBody Producto productoDetails) {
        
        Optional<Producto> productoOptional = productoRepository.findById(id);
        
        if (productoOptional.isPresent()) {
            Producto producto = productoOptional.get();
            
            producto.setNombre(productoDetails.getNombre());
            producto.setDescripcion(productoDetails.getDescripcion());
            producto.setPrecio(productoDetails.getPrecio());
            producto.setImagenUrl(productoDetails.getImagenUrl());
            producto.setCategoria(productoDetails.getCategoria());
            producto.setStock(productoDetails.getStock());
            producto.setEsActivo(productoDetails.getEsActivo());
            
            
            Producto updatedProducto = productoRepository.save(producto);
            return ResponseEntity.ok(updatedProducto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Eliminar producto (lógico - desactivar)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable Long id) {
        Optional<Producto> productoOptional = productoRepository.findById(id);
        
        if (productoOptional.isPresent()) {
            Producto producto = productoOptional.get();
            producto.setEsActivo(false);
            productoRepository.save(producto);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH: Actualizar stock
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Producto> updateStock(
            @PathVariable Long id, 
            @RequestParam Integer stock) {
        
        Optional<Producto> productoOptional = productoRepository.findById(id);
        
        if (productoOptional.isPresent()) {
            Producto producto = productoOptional.get();
            producto.setStock(stock);
            Producto updatedProducto = productoRepository.save(producto);
            return ResponseEntity.ok(updatedProducto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
