package com.milsabores.backend.controller;

import com.milsabores.backend.model.Producto;
import com.milsabores.backend.repository.ProductoRespository;
import com.milsabores.backend.services.QrService;
import com.google.zxing.WriterException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin(origins = "*")
public class QrController {

    @Autowired
    private QrService qrService;

    @Autowired
    private ProductoRespository productoRepository;

    @GetMapping("/generate/{productoId}")
    public ResponseEntity<?> generateQr(@PathVariable Long productoId)
            throws IOException, WriterException {

        System.out.println("🔍 Generando QR para producto ID = " + productoId);

        // Buscar producto
        Producto producto = productoRepository.findById(productoId).orElse(null);

        if (producto == null) {
            System.out.println("❌ Producto no encontrado");
            return ResponseEntity
                    .status(404)
                    .body("Producto no encontrado");
        }

        if (producto.getCategoria() == null || producto.getCategoria().isEmpty()) {
            System.out.println("❌ El producto existe pero categoría es NULL o vacía");
            return ResponseEntity
                    .status(500)
                    .body("El producto no tiene categoría asignada");
        }

        String categoria = producto.getCategoria(); // String (TU DB así lo tiene)

        // CONTENIDO EXACTO PARA LA APP
        String qrContent = categoria + ";" + productoId;

        System.out.println("📦 Contenido QR generado: " + qrContent);

        byte[] qrImage = qrService.generateQRCode(qrContent, 300, 300);

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/png")
                .body(qrImage);
    }
}
