package com.milsabores.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO para Perfil de Usuario.
 * NOTE: telefono/direccion removed per user request. Fields reflect Usuario entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerfilDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    // fechaNacimiento stored as String in Usuario entity
    private String fechaNacimiento;
    private Integer edad;
    private Boolean isDuoc;
    private Boolean hasFelices50;
    private String preferencias;
    private LocalDateTime fechaRegistro;
}
