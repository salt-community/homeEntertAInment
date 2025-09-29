package com.bestgroup.HomeEntertAInment.storybuilder.service;

import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.ConvertApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Service for converting story markdown content to PDF using ConvertAPI
 * Handles PDF generation for stories via ConvertAPI's REST endpoint
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PdfConversionService {

    @Value("${CONVERT_MD_TO_PDF_API_TOKEN:}")
    private String convertApiToken;

    // ConvertAPI endpoint for markdown to PDF conversion
    private static final String MARKDOWN_TO_PDF_URL = "https://v2.convertapi.com/convert/md/to/pdf";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Converts markdown content to PDF using ConvertAPI
     *
     * @param markdownContent The markdown content to convert
     * @param coverImageUrl   Optional cover image URL to include
     * @return ConvertApiResponse containing the conversion result with PDF file URL
     * @throws RuntimeException if the API call fails
     */
    public ConvertApiResponse convertMarkdownToPdf(String markdownContent, String coverImageUrl) {
        if (markdownContent == null || markdownContent.trim().isEmpty()) {
            throw new IllegalArgumentException("Markdown content cannot be null or empty");
        }

        if (convertApiToken == null || convertApiToken.trim().isEmpty()) {
            throw new IllegalStateException("ConvertAPI token is not configured. Please set CONVERT_API_TOKEN in application.yml");
        }

        log.info("Converting story markdown content to PDF using ConvertAPI");

        try {
            // Prepare the markdown content with cover image if available
            String fullMarkdown = markdownContent;
            if (coverImageUrl != null && !coverImageUrl.trim().isEmpty()) {
                fullMarkdown = "![Cover Image](" + coverImageUrl + ")\n\n# Story\n\n" + markdownContent;
            }

            // Base64 encode the markdown content
            String base64Markdown = java.util.Base64.getEncoder()
                .encodeToString(fullMarkdown.getBytes(java.nio.charset.StandardCharsets.UTF_8));

            // Prepare the request body for ConvertAPI
            java.util.Map<String, Object> requestBody = java.util.Map.of(
                "Parameters", java.util.List.of(
                    java.util.Map.of(
                        "Name", "File",
                        "FileValue", java.util.Map.of(
                            "Name", "story.md",
                            "Data", base64Markdown
                        )
                    ),
                    java.util.Map.of(
                        "Name", "StoreFile",
                        "Value", true
                    )
                )
            );

            // Set up HTTP headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + convertApiToken);

            HttpEntity<java.util.Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make the API call
            ResponseEntity<ConvertApiResponse> response = restTemplate.exchange(
                MARKDOWN_TO_PDF_URL,
                HttpMethod.POST,
                entity,
                ConvertApiResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("Successfully converted story markdown to PDF. Conversion cost: {}",
                    response.getBody().getConversionCost());
                return response.getBody();
            } else {
                throw new RuntimeException("ConvertAPI returned unexpected response: " + response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Error converting story markdown to PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to convert story markdown to PDF: " + e.getMessage(), e);
        }
    }
}
