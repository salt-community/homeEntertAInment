package com.bestgroup.HomeEntertAInment.boardgame.controller;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ConvertApiResponseDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.DecodedConvertApiResponse;
import com.bestgroup.HomeEntertAInment.boardgame.service.ConvertApiService;
import com.bestgroup.HomeEntertAInment.boardgame.utils.DecodeBase64ToString;
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
     * @return ResponseEntity containing the decoded conversion result
     */
    @PostMapping("/pdf-to-text")
    public ResponseEntity<DecodedConvertApiResponse> convertPdfToText(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Received request to convert PDF rule book: {}", file.getOriginalFilename());

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            ConvertApiResponseDto result = convertApiService.convertPdfToText(file);
            
            // Transform ConvertApiResponseDto to DecodedConvertApiResponse
            DecodedConvertApiResponse decodedResponse = transformToDecodedResponse(result);
            
            return ResponseEntity.ok(decodedResponse);

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

    /**
     * Transforms ConvertApiResponseDto to DecodedConvertApiResponse
     * Extracts the first file from the response and decodes its content
     *
     * @param response The original ConvertAPI response
     * @return DecodedConvertApiResponse with decoded text content
     */
    private DecodedConvertApiResponse transformToDecodedResponse(ConvertApiResponseDto response) {
        if (response == null || response.getFiles() == null || response.getFiles().isEmpty()) {
            throw new IllegalStateException("No files found in the conversion response");
        }

        // Get the first converted file (assuming single file conversion)
        ConvertApiResponseDto.ConvertedFile file = response.getFiles().get(0);
        
        // Decode the Base64 file data to get the text content
        String decodedData = DecodeBase64ToString.decode(file.getFileData());
        
        return new DecodedConvertApiResponse(
            file.getFileName(),
            file.getFileExt(),
            file.getFileSize(),
            file.getFileData(), // codedData (original Base64)
            decodedData         // decodedData (decoded text)
        );
    }

}
