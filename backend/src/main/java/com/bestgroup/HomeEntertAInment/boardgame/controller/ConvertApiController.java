package com.bestgroup.HomeEntertAInment.boardgame.controller;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ConvertApiResponseDto;
import com.bestgroup.HomeEntertAInment.boardgame.service.ConvertApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Controller for handling PDF to text conversion requests for board game rule books
 */
@RestController
@RequestMapping("/api/boardgame/convert")
@RequiredArgsConstructor
@Slf4j
public class ConvertApiController {

    private final ConvertApiService convertApiService;

    /**
     * Endpoint to convert a PDF file to text for board game rule analysis
     *
     * @param file The PDF file to convert (typically a board game rule book)
     * @return ResponseEntity containing the conversion result
     */
    @PostMapping("/pdf-to-text")
    public ResponseEntity<ConvertApiResponseDto> convertPdfToText(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Received request to convert PDF rule book: {}", file.getOriginalFilename());
            
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            ConvertApiResponseDto result = convertApiService.convertPdfToText(file);
            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Error processing file: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            log.error("Unexpected error during PDF conversion: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
