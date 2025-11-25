package com.milsabores.backend.controller;

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

    // Genera un QR que contiene SOLO el texto recibido
    @GetMapping("/generate/{codigo}")
    public ResponseEntity<byte[]> generateQr(@PathVariable String codigo)
            throws IOException, WriterException {

        // El QR contendrá exactamente "codigo", sin URL ni nada extra
        byte[] qrImage = qrService.generateQRCode(codigo, 300, 300);

        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/png")
                .body(qrImage);
    }
}
