package com.milsabores.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorias")
@Data
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;
    
    @Column(name = "descripcion")
    private String descripcion;
    
    @Column(name = "imagen_url")
    private String imagenUrl;
    
    @Column(name = "color", length = 7)
    private String color; // Código hexadecimal para UI
    
    @Column(name = "orden")
    private Integer orden = 0;
    
    @Column(name = "es_activa")
    private Boolean esActiva = true;
    
    // Relación con subcategorías (Auto-relación)
    @ManyToOne
    @JoinColumn(name = "categoria_padre_id")
    private Categoria categoriaPadre;
    
    @OneToMany(mappedBy = "categoriaPadre", cascade = CascadeType.ALL)
    private List<Categoria> subcategorias = new ArrayList<>();
    
    // Relación con productos
    @OneToMany(mappedBy = "categoria")
    private List<Producto> productos = new ArrayList<>();
}
