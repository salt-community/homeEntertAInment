package com.bestgroup.HomeEntertAInment.storybuilder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

/**
 * Image generation
 */
@Service
@RequiredArgsConstructor
public class ImageService {

    @Value("${RUNWARE_API_KEY}")
    private String apiKey;

    private static final String URL = "https://api.runware.ai/v1/image-inference";
    private final RestTemplate restTemplate = new RestTemplate();

    public String generateImage(String prompt, int width, int height, int numberResults) {
        try {
            // Check if API key is configured
            if (apiKey == null || apiKey.trim().isEmpty()) {
                return "Error: RUNWARE_API_KEY is not configured. Please set the environment variable.";
            }

            String taskUUID = UUID.randomUUID().toString();

            // Runware API expects an array of objects
            Map<String, Object> requestObject = Map.of(
                "taskType", "imageInference",
                "taskUUID", taskUUID,
                "positivePrompt", prompt,
                "width", width,
                "height", height,
                "model", "runware:101@1",
                "numberResults", numberResults
            );

            // Wrap the request object in an array as required by Runware API
            List<Map<String, Object>> requestBody = List.of(requestObject);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<List<Map<String, Object>>> entity = new HttpEntity<>(, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                URL, HttpMethod.POST, entity, Map.class
            );

            Map<String, Object> responseBody = Objects.requireNonNull(response.getBody());

            List<Map<String, Object>> data = (List<Map<String, Object>>) responseBody.get("data");
            if (data != null && !data.isEmpty() && data.get(0).containsKey("imageURL")) {
                return (String) data.get(0).get("imageURL");
            }

            return "Error: no images returned from Runware. Full response: " + responseBody;

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            return "Error: HTTP " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (Exception e) {
            return "Error: failed to generate image – " + e.getMessage();
        }
    }

}
