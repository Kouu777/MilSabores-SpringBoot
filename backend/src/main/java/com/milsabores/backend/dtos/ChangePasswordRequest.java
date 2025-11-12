package com.milsabores.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para cambio de contraseña
 * Ubicación: backend/src/main/java/com/milsabores/backend/dtos/ChangePasswordRequest.java
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    private String passwordActual;
    private String passwordNuevo;
    private String passwordConfirmar;
}
