package com.milsabores.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.function.Function;
import java.util.logging.Logger;

@Component
public class JwtUtil {

    private static final Logger LOGGER = Logger.getLogger(JwtUtil.class.getName());

    @Value("${jwt.secret:miClaveSecretaMuySeguraParaJWTDeMilSabores2024QueEsMuyLargaParaQueFuncioneCorrectamente}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 horas por defecto
    private Long expiration;

    private SecretKey getSigningKey() {
        // Validar longitud de la clave secreta
        if (secret.length() < 32) {
            LOGGER.warning("La clave secreta es demasiado corta. Se generará una clave segura automáticamente.");
            return Keys.secretKeyFor(SignatureAlgorithm.HS256);
        }
        // Convertir la clave secreta a bytes usando UTF-8
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String extractUsername(String token) {
        try {
            return extractClaim(token, claims -> claims.getSubject());
        } catch (Exception e) {
            LOGGER.severe("Error al extraer el nombre de usuario del token: " + e.getMessage());
            return null;
        }
    }

    // Método auxiliar para extraer un claim específico
    public <T> T extractClaim(String token, Function<io.jsonwebtoken.Claims, T> claimsResolver) {
        final io.jsonwebtoken.Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        
        throw new UnsupportedOperationException("Unimplemented method 'generateToken'");
    }

    public boolean validateToken(String jwt, UserDetails userDetails) {
        throw new UnsupportedOperationException("Unimplemented method 'validateToken'");
    }
}