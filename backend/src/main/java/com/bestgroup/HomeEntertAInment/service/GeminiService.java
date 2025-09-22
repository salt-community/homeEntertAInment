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

/**
 * Service for interacting with Google's Gemini API
 * Handles API communication and response processing
 */
@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    // Gemini API endpoint for content generation
    private static final String URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends a test prompt to Gemini API to check connectivity and functionality
     *
     * @return The response text from Gemini API
     */
    public String sendTestPrompt() {

        // Test prompt as specified in requirements
        String prompt = "This is just a status check. If you are receiving this, answer with a flat string being 'Online: Gemini Controller is up'.";

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
            String resultText = Objects.requireNonNull(response.getBody())
                    .candidates().get(0)
                    .content().parts().get(0)
                    .text();
            return resultText;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to communicate with Gemini API - " + e.getMessage();
        }
    }

    /**
     * Generates an AI response for board game rule questions
     * 
     * @param chatHistory Complete chat history for context
     * @param userQuestion The specific question asked by the user
     * @param players List of players in the current game session
     * @param ruleSetData The decoded rule set data for the game
     * @return AI-generated response text
     */
    public String generateGameRuleResponse(String chatHistory, String userQuestion, String players, String ruleSetData) {
        
        // Construct the prompt for board game rule assistance
        String prompt = String.format("""
            You are a helpful board game rules assistant. Please answer the following question about the game rules.
            
            Game Rules:
            %s
            
            Players in this session:
            %s
            
            Chat History:
            %s
            
            Current Question:
            %s
            
            Please provide a clear, helpful answer based on the game rules. If the question is not directly answered by the rules, 
            provide the most relevant information and suggest where the player might find more details. Keep your response 
            family-friendly and concise.
            """, ruleSetData, players, chatHistory, userQuestion);

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
            String resultText = Objects.requireNonNull(response.getBody())
                    .candidates().get(0)
                    .content().parts().get(0)
                    .text();
            return resultText;

        } catch (Exception e) {
            e.printStackTrace();
            return "I apologize, but I'm having trouble accessing the game rules right now. Please try asking your question again or check the rule book for more details.";
        }
    }
}
