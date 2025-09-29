package com.bestgroup.HomeEntertAInment.service;

import com.bestgroup.HomeEntertAInment.dto.GeminiResponseDto;
import com.bestgroup.HomeEntertAInment.dto.MovieRequestDto;
import com.bestgroup.HomeEntertAInment.dto.MovieResponseDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Service for movie recommendations using Gemini API
 */
@Service
@RequiredArgsConstructor
public class MovieService {

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    // Gemini API endpoint for content generation
    private static final String URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generate movie recommendations based on user preferences
     *
     * @param request The movie request containing user preferences
     * @return MovieResponseDto containing top 5 movie recommendations
     */
    public MovieResponseDto generateMovieRecommendations(MovieRequestDto request) {
        String prompt = buildMoviePrompt(request);
        return sendGeminiRequest(prompt, "I apologize, but I'm having trouble generating movie recommendations right now. Please try again later.");
    }

    /**
     * Build a comprehensive prompt for movie recommendations
     */
    private String buildMoviePrompt(MovieRequestDto request) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("You are a movie recommendation expert. Based on the following preferences, recommend exactly 5 movies with detailed information. ");
        prompt.append("IMPORTANT: Respond ONLY with a valid JSON object. Do not include any markdown formatting, code blocks, or explanatory text. Do NOT include posterUrl or any image URLs. Just the raw JSON:\n");
        prompt.append("{\n");
        prompt.append("  \"movies\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"title\": \"Movie Title\",\n");
        prompt.append("      \"year\": 2023,\n");
        prompt.append("      \"imdbId\": \"tt1234567\",\n");
        prompt.append("      \"genres\": [\"Genre1\", \"Genre2\"],\n");
        prompt.append("      \"description\": \"Brief plot description\",\n");
        prompt.append("      \"duration\": 120,\n");
        prompt.append("      \"ageRating\": \"PG-13\",\n");
        prompt.append("      \"director\": \"Director Name\",\n");
        prompt.append("      \"cast\": [\"Actor1\", \"Actor2\", \"Actor3\"],\n");
        prompt.append("      \"rating\": 8.5,\n");
        prompt.append("      \"recommendationReason\": \"Why this movie matches the preferences\"\n");
        prompt.append("    }\n");
        prompt.append("  ]\n");
        prompt.append("}\n\n");

        prompt.append("User Preferences:\n");
        
        if (request.getGenres() != null && !request.getGenres().isEmpty()) {
            prompt.append("Genres: ").append(String.join(", ", request.getGenres())).append("\n");
        }
        
        if (request.getAgeRating() != null && !request.getAgeRating().isEmpty()) {
            prompt.append("Age Rating: ").append(request.getAgeRating()).append("\n");
        }
        
        if (request.getDuration() != null) {
            prompt.append("Duration: Around ").append(request.getDuration()).append(" minutes\n");
        }
        
        if (request.getDecade() != null && !request.getDecade().isEmpty()) {
            prompt.append("Release Decade: ").append(request.getDecade()).append("\n");
        }
        
        if (request.getMood() != null && !request.getMood().isEmpty()) {
            prompt.append("Mood: ").append(request.getMood()).append("\n");
        }
        
        if (request.getCustomDescription() != null && !request.getCustomDescription().isEmpty()) {
            prompt.append("Additional Description: ").append(request.getCustomDescription()).append("\n");
        }

        prompt.append("\nRequirements:\n");
        prompt.append("- Recommend exactly 5 movies\n");
        prompt.append("- Include a mix of well-known and lesser-known quality films\n");
        prompt.append("- Provide accurate information about each movie\n");
        prompt.append("- Do NOT include posterUrl or any image URLs\n");
        prompt.append("- Explain why each movie matches the user's preferences\n");
        prompt.append("- Focus on movies that are easily accessible (available on streaming platforms)\n");

        return prompt.toString();
    }

    /**
     * Send request to Gemini API and parse the response
     */
    private MovieResponseDto sendGeminiRequest(String prompt, String errorMessage) {
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

        String resultText = "";
        try {
            // Construct the full URL with API key
            String fullUrl = URL + "?key=" + apiKey;

            // Make the API call
            ResponseEntity<GeminiResponseDto> response = restTemplate.exchange(
                    fullUrl, HttpMethod.POST, entity, GeminiResponseDto.class
            );

            // Extract the response text from the nested structure
            resultText = Objects.requireNonNull(response.getBody())
                    .candidates().get(0)
                    .content().parts().get(0)
                    .text();

            // Clean the response text to handle markdown code blocks
            String cleanedJson = cleanJsonResponse(resultText);
            System.out.println("Cleaned JSON response: " + cleanedJson);

            // Parse the JSON response
            return objectMapper.readValue(cleanedJson, MovieResponseDto.class);

        } catch (JsonProcessingException e) {
            System.err.println("Failed to parse Gemini response as JSON: " + e.getMessage());
            System.err.println("Raw response: " + resultText);
            return createErrorResponse(errorMessage);
        } catch (Exception e) {
            System.err.println("Failed to communicate with Gemini API: " + e.getMessage());
            e.printStackTrace();
            return createErrorResponse(errorMessage);
        }
    }

    /**
     * Clean the response text to extract JSON from markdown code blocks
     */
    private String cleanJsonResponse(String response) {
        if (response == null || response.trim().isEmpty()) {
            return "{}";
        }

        String cleaned = response.trim();

        // Remove markdown code block markers
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }

        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }

        // Remove any leading/trailing whitespace
        cleaned = cleaned.trim();

        // If it's still empty or not valid JSON, return empty object
        if (cleaned.isEmpty() || (!cleaned.startsWith("{") && !cleaned.startsWith("["))) {
            return "{}";
        }

        return cleaned;
    }

    /**
     * Create an error response when API calls fail
     */
    private MovieResponseDto createErrorResponse(String errorMessage) {
        return MovieResponseDto.builder()
                .movies(List.of(MovieResponseDto.MovieDto.builder()
                        .title("Error")
                        .description(errorMessage)
                        .build()))
                .build();
    }
}
