package com.milsabores.backend.controller;

import com.milsabores.backend.services.QrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
public class QrController {

    @Autowired
    private QrService qrService;

    @GetMapping("/{productId}")
    public ResponseEntity<byte[]> getProductQr(@PathVariable String productId) {
        try {
            byte[] qrBytes = qrService.generateQRCode(productId, 300, 300);

            return ResponseEntity
                    .ok()
                    .header("Content-Type", "image/png")
                    .body(qrBytes);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
