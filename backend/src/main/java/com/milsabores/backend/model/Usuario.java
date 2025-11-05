package com.milsabores.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;
    
    @Column(name = "apellido", nullable = false, length = 50)
    private String apellido;
    
    @Email
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "es_activo")
    private Boolean esActivo = true;

    @Column(name = "fecha_nacimiento")
    private String fechaNacimiento;
    
    @Column(name = "edad")
    private Integer edad;
    
    @Column(name = "es_duoc")
    private Boolean isDuoc = false;
    
    @Column(name = "tiene_felices50")
    private Boolean hasFelices50 = false;
    
    @Column(name = "preferencias", length = 500)
    private String preferencias;
    
    @Column(name = "cupon", length = 50)
    private String cupon;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "rol", length = 20)
    private RolUsuario rol = RolUsuario.CLIENTE;
    
    // Relación con pedidos
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Pedido> pedidos = new ArrayList<>();
    
    // Relación con preferencias/fav
    @ManyToMany
    @JoinTable(
        name = "usuario_favoritos",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "producto_id")
    )
    private List<Producto> productosFavoritos = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
    
    public enum RolUsuario {
        ADMIN, CLIENTE, REPARTIDOR
    }
}
