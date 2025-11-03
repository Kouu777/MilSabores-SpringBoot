package com.milsabores.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "numero_pedido", unique = true, length = 20)
    private String numeroPedido;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(name = "fecha_pedido")
    private LocalDateTime fechaPedido;
    
    @Column(name = "fecha_entrega_estimada")
    private LocalDateTime fechaEntregaEstimada;
    
    @Column(name = "fecha_entrega_real")
    private LocalDateTime fechaEntregaReal;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;
    
    @Column(name = "subtotal", precision = 10, scale = 2)
    private Double subtotal;
    
    @Column(name = "costo_envio", precision = 10, scale = 2)
    private Double costoEnvio;
    
    @Column(name = "total", precision = 10, scale = 2)
    private Double total;
    
    @Column(name = "direccion_entrega")
    private String direccionEntrega;
    
    @Column(name = "instrucciones_entrega")
    private String instruccionesEntrega;
    
    @Column(name = "metodo_pago", length = 30)
    private String metodoPago;
    
    // Relación con items del pedido
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> items = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        fechaPedido = LocalDateTime.now();
        // Generar número de pedido único
        if (numeroPedido == null) {
            numeroPedido = "MS" + System.currentTimeMillis();
        }
    }
    
    public enum EstadoPedido {
        PENDIENTE, CONFIRMADO, PREPARACION, EN_CAMINO, ENTREGADO, CANCELADO
    }
}
