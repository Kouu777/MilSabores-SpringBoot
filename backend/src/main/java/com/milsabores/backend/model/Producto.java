package com.milsabores.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
@Data
public class Producto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "descripcion")
    private String descripcion;
    
    // ⚠️ SOLO esto - SIN precision y scale
    @Column(name = "precio", nullable = false)
    private Double precio;
    
    @Column(name = "imagen_url")
    private String imagenUrl;
    
    @Column(name = "categoria", nullable = false)
    private String categoria;
    
    @Column(name = "stock")
    private Integer stock = 0;
    
    @Column(name = "es_activo")
    private Boolean esActivo = true;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @ManyToMany
    @JoinTable(
        name = "producto_ingrediente",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "ingrediente_id")
    )
    private List<Ingrediente> ingredientes = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }
}