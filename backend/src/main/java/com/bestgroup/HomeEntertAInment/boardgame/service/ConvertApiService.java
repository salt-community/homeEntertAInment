package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ConvertApiResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Service for converting PDF files to text using ConvertAPI
 * Handles PDF to text conversion via ConvertAPI's REST endpoint
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ConvertApiService {

    @Value("${CONVERT_API_TOKEN:}")
    private String convertApiToken;

    // ConvertAPI endpoint for PDF to text conversion
    private static final String CONVERT_API_URL = "https://v2.convertapi.com/convert/pdf/to/txt";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Converts a PDF file to text using ConvertAPI
     *
     * @param pdfFile The PDF file to convert (MultipartFile)
     * @return ConvertApiResponseDto containing the conversion result
     * @throws IOException      if there's an error reading the file
     * @throws RuntimeException if the API call fails
     */
    public ConvertApiResponseDto convertPdfToText(MultipartFile pdfFile) throws IOException {
        if (pdfFile == null || pdfFile.isEmpty()) {
            throw new IllegalArgumentException("PDF file cannot be null or empty");
        }

        if (convertApiToken == null || convertApiToken.trim().isEmpty()) {
            throw new IllegalStateException("ConvertAPI token is not configured. Please set CONVERT_API_TOKEN in application.yml");
        }

        log.info("Converting PDF file: {} to text using ConvertAPI", pdfFile.getOriginalFilename());

        try {
            // Prepare multipart form data
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            // Add the PDF file
            body.add("File", new ByteArrayResource(pdfFile.getBytes()) {
                @Override
                public String getFilename() {
                    return pdfFile.getOriginalFilename();
                }
            });


            // Set StoreFile to true as requested
//            body.add("StoreFile", "true");

            // Set up HTTP headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("Authorization", "Bearer " + convertApiToken);

            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

            // Make the API call
            ResponseEntity<ConvertApiResponseDto> response = restTemplate.exchange(
                    CONVERT_API_URL,
                    HttpMethod.POST,
                    entity,
                    ConvertApiResponseDto.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("Successfully converted PDF to text. Conversion cost: {}",
                        response.getBody().getConversionCost());
                return response.getBody();
            } else {
                throw new RuntimeException("ConvertAPI returned unexpected response: " + response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Error converting PDF to text: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to convert PDF to text: " + e.getMessage(), e);
        }
    }

    /**
     * Wrapper class to properly handle MultipartFile for RestTemplate
     */
    private static class MultipartFileResource implements org.springframework.core.io.Resource {
        private final MultipartFile multipartFile;

        public MultipartFileResource(MultipartFile multipartFile) {
            this.multipartFile = multipartFile;
        }

        @Override
        public boolean exists() {
            return true;
        }

        @Override
        public boolean isReadable() {
            return true;
        }

        @Override
        public boolean isOpen() {
            return false;
        }

        @Override
        public boolean isFile() {
            return false;
        }

        @Override
        public java.net.URL getURL() throws java.io.IOException {
            throw new UnsupportedOperationException("getURL not supported");
        }

        @Override
        public java.net.URI getURI() throws java.io.IOException {
            throw new UnsupportedOperationException("getURI not supported");
        }

        @Override
        public java.io.File getFile() throws java.io.IOException {
            throw new UnsupportedOperationException("getFile not supported");
        }

        @Override
        public long contentLength() throws java.io.IOException {
            return multipartFile.getSize();
        }

        @Override
        public long lastModified() throws java.io.IOException {
            return System.currentTimeMillis();
        }

        @Override
        public org.springframework.core.io.Resource createRelative(String relativePath) throws java.io.IOException {
            throw new UnsupportedOperationException("createRelative not supported");
        }

        @Override
        public String getFilename() {
            return multipartFile.getOriginalFilename();
        }

        @Override
        public String getDescription() {
            return "MultipartFile[" + multipartFile.getOriginalFilename() + "]";
        }

        @Override
        public java.io.InputStream getInputStream() throws java.io.IOException {
            return multipartFile.getInputStream();
        }
    }
}
