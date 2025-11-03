package com.milsabores.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milsabores.backend.model.Pedido;
import com.milsabores.backend.model.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long>{
       // Buscar pedidos por usuario
       List<Pedido> findByUsuario(Usuario usuario);
    
       // Buscar pedidos por estado
       List<Pedido> findByEstado(Pedido.EstadoPedido estado);
       
       // Buscar pedidos por usuario y estado
       List<Pedido> findByUsuarioAndEstado(Usuario usuario, Pedido.EstadoPedido estado);
       
       // Buscar pedidos por fecha
       List<Pedido> findByFechaPedidoBetween(LocalDateTime inicio, LocalDateTime fin);
       
       // Buscar por número de pedido
       Optional<Pedido> findByNumeroPedido(String numeroPedido);
       
       // Consulta para dashboard
       @Query("SELECT p.estado, COUNT(p) FROM Pedido p WHERE p.fechaPedido BETWEEN :inicio AND :fin GROUP BY p.estado")
       List<Object[]> contarPedidosPorEstadoEnPeriodo(
           @Param("inicio") LocalDateTime inicio, 
           @Param("fin") LocalDateTime fin
       );
       
       // Calcular total de ventas en periodo
       @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.fechaPedido BETWEEN :inicio AND :fin AND p.estado = 'ENTREGADO'")
       Double calcularTotalVentasEnPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}
