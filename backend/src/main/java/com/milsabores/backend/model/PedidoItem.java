package com.milsabores.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "pedido_items")
@Data
public class PedidoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;
    
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
    
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;
    
    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private Double precioUnitario;
    
    @Column(name = "subtotal", precision = 10, scale = 2)
    private Double subtotal;
    
    @PrePersist
    @PreUpdate
    protected void calcularSubtotal() {
        if (precioUnitario != null && cantidad != null) {
            subtotal = precioUnitario * cantidad;
        }
    }
}

