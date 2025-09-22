package com.bestgroup.HomeEntertAInment.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.bestgroup.HomeEntertAInment.dto.GeminiResponseDto;
import com.bestgroup.HomeEntertAInment.dto.QuizConfigurationDto;

import lombok.RequiredArgsConstructor;

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
     * Generates a quiz using the Gemini API based on the provided configuration
     * 
     * @param config The quiz configuration containing age group, topics, difficulty, and question count
     * @return JSON string representation of the generated quiz that can be converted to Quiz model
     */
    public String sendQuizPrompt(QuizConfigurationDto config) {
        // Build the prompt using configuration parameters
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("Generate a quiz in JSON format with the following specifications:\n\n");
        
        // Add configuration details to the prompt
        promptBuilder.append("Age Group: ").append(config.getAgeGroup()).append("\n");
        promptBuilder.append("Topics: ").append(String.join(", ", config.getTopics())).append("\n");
        promptBuilder.append("Difficulty: ").append(config.getDifficulty()).append("\n");
        promptBuilder.append("Number of Questions: ").append(config.getQuestionCount()).append("\n\n");
        
        // Add detailed instructions for JSON structure
        promptBuilder.append("Return a JSON object with the following structure:\n");
        promptBuilder.append("{\n");
        promptBuilder.append("  \"id\": \"unique-quiz-id\",\n");
        promptBuilder.append("  \"title\": \"Engaging quiz title related to the topics\",\n");
        promptBuilder.append("  \"description\": \"Brief description of the quiz content\",\n");
        promptBuilder.append("  \"ageGroup\": \"").append(config.getAgeGroup()).append("\",\n");
        promptBuilder.append("  \"topics\": [").append(String.join(", ", config.getTopics().stream().map(topic -> "\"" + topic + "\"").toArray(String[]::new))).append("],\n");
        promptBuilder.append("  \"difficulty\": \"").append(config.getDifficulty()).append("\",\n");
        promptBuilder.append("  \"questionCount\": ").append(config.getQuestionCount()).append(",\n");
        promptBuilder.append("  \"createdAt\": \"2024-01-01T00:00:00\",\n");
        promptBuilder.append("  \"questions\": [\n");
        promptBuilder.append("    {\n");
        promptBuilder.append("      \"id\": \"question-1\",\n");
        promptBuilder.append("      \"questionText\": \"Clear and engaging question text\",\n");
        promptBuilder.append("      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n");
        promptBuilder.append("      \"correctAnswerIndex\": 0,\n");
        promptBuilder.append("      \"explanation\": \"Educational explanation of why the answer is correct\",\n");
        promptBuilder.append("      \"topic\": \"Relevant topic from the list\",\n");
        promptBuilder.append("      \"difficulty\": \"").append(config.getDifficulty()).append("\",\n");
        promptBuilder.append("      \"ageGroup\": \"").append(config.getAgeGroup()).append("\"\n");
        promptBuilder.append("    }\n");
        promptBuilder.append("  ]\n");
        promptBuilder.append("}\n\n");
        
        // Add content safety and quality guidelines
        promptBuilder.append("IMPORTANT GUIDELINES:\n");
        promptBuilder.append("- Ensure all content is family-friendly and age-appropriate\n");
        promptBuilder.append("- Questions should be educational and engaging\n");
        promptBuilder.append("- Provide clear, accurate explanations for answers\n");
        promptBuilder.append("- Distribute questions across the specified topics\n");
        promptBuilder.append("- Match the difficulty level to the age group\n");
        promptBuilder.append("- Use proper JSON formatting with no syntax errors\n");
        promptBuilder.append("- Generate exactly ").append(config.getQuestionCount()).append(" questions\n");
        promptBuilder.append("- Each question must have exactly 4 multiple choice options\n");
        promptBuilder.append("- correctAnswerIndex should be 0, 1, 2, or 3 (zero-based)\n");
        promptBuilder.append("- Return ONLY the JSON object, no additional text or formatting");
        
        String prompt = promptBuilder.toString();
        
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
            return "Error: Failed to generate quiz via Gemini API - " + e.getMessage();
        }
    }
}
