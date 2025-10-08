package com.bestgroup.HomeEntertAInment.service;

import com.bestgroup.HomeEntertAInment.dto.GeminiResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GeminiStoryService {

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    // Gemini API endpoint for content generation
    private static final String URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private final RestTemplate restTemplate = new RestTemplate();

    public String sendStoryPrompt(String prompt) {
        // Prepare the request body according to Gemini API specification
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        // Set up HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // Construct the full URL with API key
            String fullUrl = URL + "?key=" + apiKey;

            // Make the API call
            ResponseEntity<GeminiResponseDto> response = restTemplate.exchange(
                    fullUrl, HttpMethod.POST, entity, GeminiResponseDto.class
            );

            // Extract the response text from the nested structure
            return Objects.requireNonNull(response.getBody())
                    .candidates().getFirst()
                    .content().parts().getFirst()
                    .text()
                    .replaceAll("```markdown", "")
                    .replaceAll("```md", "")
                    .replaceAll("```", "");

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to communicate with Gemini API - " + e.getMessage();
        }
    }
}
