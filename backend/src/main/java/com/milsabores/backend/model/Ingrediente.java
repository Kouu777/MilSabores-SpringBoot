package com.milsabores.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ingredientes")
@Data
public class Ingrediente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;
    
    @Column(name = "descripcion")
    private String descripcion;
    
    @Column(name = "categoria")
    private String categoria; // "vegetal", "fruta", "carne", "lacteo", "cereal"
    
    @Column(name = "es_alergenico")
    private Boolean esAlergenico = false;
    
    // Relación inversa con productos
    @ManyToMany(mappedBy = "ingredientes")
    private List<Producto> productos = new ArrayList<>();
}
