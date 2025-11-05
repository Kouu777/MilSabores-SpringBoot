package com.milsabores.backend.dtos;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String nombre;
    private String apellido;
    private String fechaNacimiento;
    private String preferencias;
    private String password;
    private String email;
}