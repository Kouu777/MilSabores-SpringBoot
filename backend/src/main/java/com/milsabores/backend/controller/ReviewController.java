package com.milsabores.backend.controller;

import com.milsabores.backend.dtos.ReviewRequest;
import com.milsabores.backend.dtos.ReviewResponse;
import com.milsabores.backend.model.Review;
import com.milsabores.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    private final String IMAGE_FOLDER = "src/main/resources/static/images/";

    // --------------------------------------------------------------
    // POST → Crear review (Base64)
    // --------------------------------------------------------------
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> crearReview(@PathVariable Long id,
                                         @RequestBody ReviewRequest reviewRequest) {
        try {
            Review review = new Review();
            review.setProductoId(Long.parseLong(
                    reviewRequest.getProductId() != null ? reviewRequest.getProductId() : id.toString()
            ));
            review.setUsuario(reviewRequest.getUserName() != null ? reviewRequest.getUserName() : "Anónimo");
            review.setTexto(reviewRequest.getComment());
            review.setRating(reviewRequest.getRating() != null ? reviewRequest.getRating() : 0);
            review.setFecha(LocalDateTime.now());

            // Guardar imagen si viene Base64
            if (reviewRequest.getImageBase64() != null && !reviewRequest.getImageBase64().isEmpty()) {
                try {
                    // Crear carpeta si no existe
                    File folder = new File(IMAGE_FOLDER);
                    if (!folder.exists()) folder.mkdirs();

                    String imageName = "review_" + System.currentTimeMillis() + ".jpg";
                    String path = IMAGE_FOLDER + imageName;

                    byte[] imageBytes = java.util.Base64.getDecoder().decode(reviewRequest.getImageBase64());
                    Files.write(Paths.get(path), imageBytes);

                    review.setImageUrl("/images/" + imageName);

                } catch (Exception e) {
                    e.printStackTrace();
                    review.setImageUrl(null); // fallback
                }
            }

            Review saved = reviewRepository.save(review);

            // Transformar a ReviewResponse
            ReviewResponse response = new ReviewResponse(
                    saved.getId(),
                    saved.getProductoId(),
                    saved.getUsuario(),
                    saved.getTexto(),
                    saved.getRating(),
                    saved.getImageUrl(),
                    saved.getFecha()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al guardar la reseña: " + e.getMessage());
        }
    }

    // --------------------------------------------------------------
    // GET (1) → Listar reviews de UN producto específico
    // --------------------------------------------------------------
    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> listarReviewsDeProducto(@PathVariable Long id) {
        List<Review> reviews = reviewRepository.findByProductoIdOrderByFechaDesc(id);

        List<ReviewResponse> response = reviews.stream()
                .map(r -> new ReviewResponse(
                        r.getId(),
                        r.getProductoId(),
                        r.getUsuario(),
                        r.getTexto(),
                        r.getRating(),
                        r.getImageUrl(),
                        r.getFecha()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }

    // --------------------------------------------------------------
    // GET (2) → Listar TODAS las reviews
    // --------------------------------------------------------------
    @GetMapping("/reviews-all")
    public ResponseEntity<List<ReviewResponse>> listarTodasLasReviews() {
        List<Review> reviews = reviewRepository.findAllByOrderByFechaDesc();

        List<ReviewResponse> response = reviews.stream()
                .map(r -> new ReviewResponse(
                        r.getId(),
                        r.getProductoId(),
                        r.getUsuario(),
                        r.getTexto(),
                        r.getRating(),
                        r.getImageUrl(),
                        r.getFecha()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }
}
