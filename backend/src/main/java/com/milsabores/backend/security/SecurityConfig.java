package com.milsabores.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import static org.springframework.security.config.Customizer.withDefaults;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
    .csrf(csrf -> csrf.disable())
    .cors(withDefaults())
    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
    .sessionManagement(session -> session.disable())
    .httpBasic(httpBasic -> httpBasic.disable())
    .formLogin(form -> form.disable());


    return http.build();
}

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }



}
