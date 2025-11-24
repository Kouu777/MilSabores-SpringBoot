package com.milsabores.backend.security;

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

        logger.info("Path: {} | Method: {}", servletPath, method);

        if (isPublicEndpoint(servletPath, method)) {
            logger.info("Endpoint público: {} {}", method, servletPath);
            chain.doFilter(request, response);
            return;
        }

        logger.info("Endpoint protegido: {} {}", method, servletPath);

        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("Error al extraer usuario del token: {}", e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.info("JWT válido para {}", username);
            } else {
                logger.warn("JWT inválido o expirado");
            }
        }

        chain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String path, String method) {
        if (path == null || method == null) return false;

        if (path.startsWith("/api/auth") || path.startsWith("/h2-console")) return true;

        if (path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.startsWith("/uploads"))
            return true;

        if (path.startsWith("/api/qr")) return true;

        if (path.startsWith("/api/productos") || path.startsWith("/api/categorias") || path.startsWith("/api/reviews")) {
            if (method.equals("GET") || method.equals("POST")) return true;
        }

        if (method.equals("POST") && path.contains("/reviews")) return true;

        return false;
    }
}
