package com.milsabores.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Long id;
    private Long usuarioId;
    private List<PedidoItemDTO> items;
    private Double total;
    private String estado; // PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO, CANCELADO
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
