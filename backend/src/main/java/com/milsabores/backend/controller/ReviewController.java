package com.milsabores.backend.controller;

import com.milsabores.backend.dtos.ReviewRequest;
import com.milsabores.backend.model.Review;
import com.milsabores.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.io.File;

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

        review.setProductoId(Long.parseLong(reviewRequest.getProductId() != null ? reviewRequest.getProductId() : id.toString()));
        review.setUsuario(reviewRequest.getUserName() != null ? reviewRequest.getUserName() : "Anónimo");
        review.setTexto(reviewRequest.getComment());
        review.setRating(reviewRequest.getRating() != null ? reviewRequest.getRating() : 0);
        review.setFecha(LocalDateTime.now());

        // Guardar imagen si viene en Base64
        if (reviewRequest.getImageBase64() != null && !reviewRequest.getImageBase64().isEmpty()) {
            try {
                String imageName = "review_" + System.currentTimeMillis() + ".jpg";
                String path = new File("src/main/resources/static/images/").getAbsolutePath() + "/" + imageName;

                byte[] imageBytes = java.util.Base64.getDecoder().decode(reviewRequest.getImageBase64());
                java.nio.file.Files.write(java.nio.file.Paths.get(path), imageBytes);

                // Guardar URL pública
                review.setImageUrl("/images/" + imageName);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);

    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error al guardar la reseña: " + e.getMessage());
    }
}   
}
