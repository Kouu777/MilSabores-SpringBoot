package com.milsabores.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.milsabores.backend.dtos.ReviewRequest;
import com.milsabores.backend.model.Review;
import com.milsabores.backend.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para ReviewController
 * Verifica: GET listar reseñas, POST crear reseña (JSON), POST con imagen (multipart), DELETE eliminar
 */
@SpringBootTest
@AutoConfigureMockMvc
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Long productoIdTest = 1L;

    @BeforeEach
    void setup() {
        // Limpiar BD de test
        reviewRepository.deleteAll();

        // Crear algunas reseñas de prueba
        for (int i = 1; i <= 3; i++) {
            Review review = new Review();
            review.setProductoId(productoIdTest);
            review.setUsuario("Usuario" + i);
            review.setTexto("Excelente producto - Reseña " + i);
            review.setRating(4 + i % 2); // Alternamos entre 4 y 5
            review.setImageUrl(i == 2 ? "/uploads/reviews/imagen" + i + ".jpg" : null);
            reviewRepository.save(review);
        }
    }

    /**
     * Test: GET /api/productos/{productoId}/reviews
     * Verifica listar todas las reseñas de un producto
     */
    @Test
    void testListarResenasProducto() throws Exception {
        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].productoId").value(productoIdTest))
                .andExpect(jsonPath("$[0].usuario").exists())
                .andExpect(jsonPath("$[0].texto").exists())
                .andExpect(jsonPath("$[0].rating").exists())
                .andExpect(jsonPath("$[0].fecha").exists());
    }

    /**
     * Test: GET /api/productos/{productoId}/reviews para producto sin reseñas
     * Verifica que devuelve lista vacía
     */
    @Test
    void testListarResenasProductoSinResennas() throws Exception {
        Long productoSinResennas = 999L;

        mockMvc.perform(get("/api/productos/" + productoSinResennas + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    /**
     * Test: POST /api/productos/{productoId}/reviews (JSON)
     * Verifica crear una reseña sin imagen
     */
    @Test
    void testCrearResennaJSON() throws Exception {
        ReviewRequest request = new ReviewRequest();
        request.setUsuario("Juan Testero");
        request.setTexto("Muy rico y fresco, llegó rápido!");
        request.setRating(5);

        mockMvc.perform(post("/api/productos/" + productoIdTest + "/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.productoId").value(productoIdTest))
                .andExpect(jsonPath("$.usuario").value("Juan Testero"))
                .andExpect(jsonPath("$.texto").value("Muy rico y fresco, llegó rápido!"))
                .andExpect(jsonPath("$.rating").value(5));
    }

    /**
     * Test: POST /api/productos/{productoId}/reviews con usuario anónimo
     * Verifica que crea reseña con nombre "Anónimo" si no se proporciona usuario
     */
    @Test
    void testCrearResennaAnonimo() throws Exception {
        ReviewRequest request = new ReviewRequest();
        request.setTexto("Producto de excelente calidad");
        request.setRating(4);
        // No se proporciona usuario

        mockMvc.perform(post("/api/productos/" + productoIdTest + "/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario").value("Anónimo"));
    }

    /**
     * Test: POST /api/productos/{productoId}/reviews (multipart/form-data con imagen)
     * Verifica crear reseña con imagen subida
     */
    @Test
    void testCrearResennaConImagen() throws Exception {
        // Crear archivo simulado (imagen)
        MockMultipartFile imagenFile = new MockMultipartFile(
                "image",
                "resena.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake image content".getBytes()
        );

        mockMvc.perform(multipart("/api/productos/" + productoIdTest + "/reviews")
                .file(imagenFile)
                .param("usuario", "María Fotografía")
                .param("texto", "La presentación es hermosa, como en la foto!")
                .param("rating", "5")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario").value("María Fotografía"))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.imageUrl").exists())
                .andExpect(jsonPath("$.imageUrl").value(containsString("/uploads/reviews/")));
    }

    /**
     * Test: POST /api/productos/{productoId}/reviews (multipart sin imagen)
     * Verifica crear reseña multipart sin archivo (solo campos texto)
     */
    @Test
    void testCrearResennaMultipartSinImagen() throws Exception {
        mockMvc.perform(multipart("/api/productos/" + productoIdTest + "/reviews")
                .param("usuario", "Carlos Crítico")
                .param("texto", "Buen sabor pero el envío tardó")
                .param("rating", "3")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario").value("Carlos Crítico"))
                .andExpect(jsonPath("$.rating").value(3))
                .andExpect(jsonPath("$.imageUrl").doesNotExist());
    }

    /**
     * Test: GET reseña con imagen incluida
     * Verifica que se devuelve la URL de la imagen en la respuesta
     */
    @Test
    void testListarResenasConImagenes() throws Exception {
        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[1].imageUrl").value("/uploads/reviews/imagen2.jpg"));
    }

    /**
     * Test: DELETE /api/reviews/{id}
     * Verifica eliminar una reseña existente
     */
    @Test
    void testEliminarResennaExito() throws Exception {
        // Obtener ID de una reseña existente
        Review resenaExistente = reviewRepository.findByProductoIdOrderByFechaDesc(productoIdTest).get(0);
        Long resenaId = resenaExistente.getId();

        mockMvc.perform(delete("/api/reviews/" + resenaId))
                .andExpect(status().isNoContent());

        // Verificar que fue eliminada
        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2))); // De 3 a 2 reseñas
    }

    /**
     * Test: DELETE /api/reviews/{id} con ID inexistente
     * Verifica que devuelve 404
     */
    @Test
    void testEliminarResennaNoExistente() throws Exception {
        Long resenaIdNoExistente = 9999L;

        mockMvc.perform(delete("/api/reviews/" + resenaIdNoExistente))
                .andExpect(status().isNotFound());
    }

    /**
     * Test: GET ordenamiento de reseñas por fecha (más recientes primero)
     * Verifica que las reseñas se devuelven ordenadas descendente por fecha
     */
    @Test
    void testResenasOrdenPorFecha() throws Exception {
        // Agregar una reseña nueva (será la más reciente)
        ReviewRequest requestNueva = new ReviewRequest();
        requestNueva.setUsuario("Usuario Reciente");
        requestNueva.setTexto("Última reseña agregada");
        requestNueva.setRating(5);

        mockMvc.perform(post("/api/productos/" + productoIdTest + "/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestNueva)))
                .andExpect(status().isCreated());

        // Verificar que está en el índice 0 (primera en la lista, más reciente)
        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[0].usuario").value("Usuario Reciente"));
    }

    /**
     * Test: POST múltiples reseñas al mismo producto
     * Verifica que se pueden agregar varias reseñas al mismo producto
     */
    @Test
    void testMultiplesResenasProducto() throws Exception {
        for (int i = 0; i < 5; i++) {
            ReviewRequest request = new ReviewRequest();
            request.setUsuario("Usuario" + i);
            request.setTexto("Reseña número " + i);
            request.setRating((i % 5) + 1);

            mockMvc.perform(post("/api/productos/" + productoIdTest + "/reviews")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated());
        }

        // Verificar total de reseñas (3 iniciales + 5 nuevas)
        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(8)));
    }
}
