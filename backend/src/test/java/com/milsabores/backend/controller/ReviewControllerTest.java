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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para ReviewController
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
            review.setRating(4 + i % 2);
            review.setImageUrl(i == 2 ? "/uploads/reviews/imagen" + i + ".jpg" : null);
            reviewRepository.save(review);
        }
    }

    @Test
    void testListarResenasProducto() throws Exception {
        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].productoId").value(productoIdTest))
                .andExpect(jsonPath("$[0].userName").exists())
                .andExpect(jsonPath("$[0].comment").exists())
                .andExpect(jsonPath("$[0].rating").exists())
                .andExpect(jsonPath("$[0].fecha").exists());
    }

    @Test
    void testListarResenasProductoSinResennas() throws Exception {
        Long productoSinResennas = 999L;

        mockMvc.perform(get("/api/productos/" + productoSinResennas + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void testCrearResennaJSON() throws Exception {
        ReviewRequest request = new ReviewRequest();
        request.setUserName("Juan Testero");
        request.setComment("Muy rico y fresco, llegó rápido!");
        request.setRating(5);

        mockMvc.perform(post("/api/productos/" + productoIdTest + "/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.productoId").value(productoIdTest))
                .andExpect(jsonPath("$.userName").value("Juan Testero"))
                .andExpect(jsonPath("$.comment").value("Muy rico y fresco, llegó rápido!"))
                .andExpect(jsonPath("$.rating").value(5));
    }

    @Test
    void testCrearResennaAnonimo() throws Exception {
        ReviewRequest request = new ReviewRequest();
        request.setComment("Producto de excelente calidad");
        request.setRating(4);

        mockMvc.perform(post("/api/productos/" + productoIdTest + "/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userName").value("Anónimo"));
    }

    @Test
    void testCrearResennaConImagen() throws Exception {
        MockMultipartFile imagenFile = new MockMultipartFile(
                "image",
                "resena.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "fake image content".getBytes()
        );

        mockMvc.perform(multipart("/api/productos/" + productoIdTest + "/reviews")
                .file(imagenFile)
                .param("userName", "María Fotografía")
                .param("comment", "La presentación es hermosa, como en la foto!")
                .param("rating", "5")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userName").value("María Fotografía"))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.imageUrl").exists())
                .andExpect(jsonPath("$.imageUrl").value(containsString("/uploads/reviews/")));
    }

    @Test
    void testCrearResennaMultipartSinImagen() throws Exception {
        mockMvc.perform(multipart("/api/productos/" + productoIdTest + "/reviews")
                .param("userName", "Carlos Crítico")
                .param("comment", "Buen sabor pero el envío tardó")
                .param("rating", "3")
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userName").value("Carlos Crítico"))
                .andExpect(jsonPath("$.rating").value(3))
                .andExpect(jsonPath("$.imageUrl").doesNotExist());
    }

    @Test
    void testListarResenasConImagenes() throws Exception {
        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[1].imageUrl").value("/uploads/reviews/imagen2.jpg"));
    }

    @Test
    void testEliminarResennaExito() throws Exception {
        Review resenaExistente = reviewRepository.findByProductoIdOrderByFechaDesc(productoIdTest).get(0);
        Long resenaId = resenaExistente.getId();

        mockMvc.perform(delete("/api/reviews/" + resenaId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void testEliminarResennaNoExistente() throws Exception {
        Long resenaIdNoExistente = 9999L;

        mockMvc.perform(delete("/api/reviews/" + resenaIdNoExistente))
                .andExpect(status().isNotFound());
    }

    @Test
    void testResenasOrdenPorFecha() throws Exception {
        ReviewRequest requestNueva = new ReviewRequest();
        requestNueva.setUserName("Usuario Reciente");
        requestNueva.setComment("Última reseña agregada");
        requestNueva.setRating(5);

        mockMvc.perform(post("/api/productos/" + productoIdTest + "/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestNueva)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[0].userName").value("Usuario Reciente"));
    }

    @Test
    void testMultiplesResenasProducto() throws Exception {
        for (int i = 0; i < 5; i++) {
            ReviewRequest request = new ReviewRequest();
            request.setUserName("Usuario" + i);
            request.setComment("Reseña número " + i);
            request.setRating((i % 5) + 1);

            mockMvc.perform(post("/api/productos/" + productoIdTest + "/reviews")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated());
        }

        mockMvc.perform(get("/api/productos/" + productoIdTest + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(8)));
    }
}
