package com.bestgroup.HomeEntertAInment.storybuilder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Service for interacting with FAL NANO BANANA API
 * Image generation
 */
@Service
@RequiredArgsConstructor
public class ImageService {

    @Value("${FAL_API_KEY}")
    private String apiKey;
    private static final String URL = "https://fal.run/fal-ai/nano-banana";
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generates an image using fal.ai Nano Banana API
     *
     * @param prompt Description of the image you want generated
     * @param size   Size of the image (e.g., "1024x1024")
     * @return URL of the generated image, or error message
     */
    public String generateImage(String prompt, String size) {
        try {
            // Build request body
            Map<String, Object> body = Map.of(
                "prompt", prompt,
                "size", size
            );

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Key " + apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // Call API
            ResponseEntity<Map> response = restTemplate.exchange(
                URL, HttpMethod.POST, entity, Map.class
            );

            // Extract first image URL
            Map<String, Object> responseBody = Objects.requireNonNull(response.getBody());
            List<Map<String, String>> images = (List<Map<String, String>>) responseBody.get("images");

            if (images != null && !images.isEmpty()) {
                return images.get(0).get("url");
            } else {
                return "Error: No images returned from fal.ai";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to generate image - " + e.getMessage();
        }
    }
}
