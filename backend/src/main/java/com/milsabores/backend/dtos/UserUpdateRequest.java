package main.java.com.milsabores.backend.dtos;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String codigoPostal;
    private String fechaNacimiento;
    private String preferencias;
    private String password;
}