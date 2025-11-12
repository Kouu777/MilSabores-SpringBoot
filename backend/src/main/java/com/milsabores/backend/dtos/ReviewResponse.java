package com.milsabores.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long productoId;
    private String usuario;
    private String texto;
    private Integer rating;
    private String imageUrl;
    private LocalDateTime fecha;
}
