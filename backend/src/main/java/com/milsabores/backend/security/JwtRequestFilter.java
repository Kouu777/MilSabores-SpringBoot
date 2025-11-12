package com.milsabores.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String servletPath = request.getServletPath();
        String method = request.getMethod();

        logger.info("🔍 JwtRequestFilter - Path: {} | Method: {}", servletPath, method);

        // 🚫 Saltar validación JWT si es endpoint público
        if (isPublicEndpoint(servletPath, method)) {
            logger.info("✅ ENDPOINT PÚBLICO - Saltando validación JWT para: {} {}", method, servletPath);
            chain.doFilter(request, response);
            return;
        }

        // 🔒 Endpoints protegidos: validar JWT
        logger.info("🔐 ENDPOINT PROTEGIDO - Validando JWT para: {} {}", method, servletPath);

        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("❌ Error extrayendo usuario del token: {}", e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.info("✅ JWT válido para usuario {}", username);
            } else {
                logger.warn("⚠️ JWT inválido o expirado");
            }
        }

        chain.doFilter(request, response);
    }

    /**
     * ✅ Determina si el endpoint es público (no requiere JWT)
     */
    private boolean isPublicEndpoint(String path, String method) {
        if (path == null || method == null) return false;

        // --- ENDPOINTS DE AUTENTICACIÓN Y CONSOLA H2 ---
        if (path.startsWith("/api/auth") || path.startsWith("/h2-console")) return true;

        // --- DOCUMENTACIÓN Y RECURSOS PÚBLICOS ---
        if (path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.startsWith("/uploads")) return true;

        // --- PRODUCTOS / CATEGORÍAS / REVIEWS (GET y POST) ---
        if (path.startsWith("/api/productos") || path.startsWith("/api/categorias") || path.startsWith("/api/reviews")) {
            // Permitir todos los métodos comunes (GET, POST)
            if (method.equals("GET") || method.equals("POST")) return true;
        }

        // --- PERMITIR CUALQUIER POST QUE CONTENGA /reviews (como /api/productos/1/reviews) ---
        if (method.equals("POST") && path.contains("/reviews")) return true;

        return false;
    }
}
