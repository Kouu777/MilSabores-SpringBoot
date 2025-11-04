package com.milsabores.backend.dtos;

import com.milsabores.backend.model.Usuario;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Usuario usuario;
    
    public AuthResponse(String token, Usuario usuario) {
        this.token = token;
        this.usuario = usuario;
    }
}
