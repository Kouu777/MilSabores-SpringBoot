package com.milsabores.backend.controller;

import com.milsabores.backend.dtos.ReviewRequest;
import com.milsabores.backend.model.Review;
import com.milsabores.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    /**
     * Recibe una reseña desde la app móvil y la guarda en la base de datos.
     */
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> crearReview(@PathVariable Long id, @RequestBody ReviewRequest reviewRequest) {
        try {
            Review review = new Review();

            // Asignar valores directamente del DTO
            review.setProductoId(Long.parseLong(reviewRequest.getProductId() != null ? reviewRequest.getProductId() : id.toString()));
            review.setUsuario(reviewRequest.getUserName() != null ? reviewRequest.getUserName() : "Anónimo");
            review.setTexto(reviewRequest.getComment());
            review.setRating(reviewRequest.getRating() != null ? reviewRequest.getRating() : 0);
            review.setFecha(LocalDateTime.now());

            // Guardar la primera imagen si viene lista
            if (reviewRequest.getImageUrls() != null && !reviewRequest.getImageUrls().isEmpty()) {
                review.setImageUrl(reviewRequest.getImageUrls().get(0));
            }

            Review saved = reviewRepository.save(review);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al guardar la reseña: " + e.getMessage());
        }
    }

    /**
     * Obtiene todas las reseñas de un producto por su ID.
     */
    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> obtenerReviews(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(reviewRepository.findByProductoIdOrderByFechaDesc(id));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener reseñas: " + e.getMessage());
        }
    }
}
