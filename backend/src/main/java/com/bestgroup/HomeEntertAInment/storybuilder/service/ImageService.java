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
            String taskUUID = UUID.randomUUID().toString();

            List<Map<String, Object>> body = List.of(
                Map.of(
                    "taskType", "imageInference",
                    "taskUUID", taskUUID,
                    "positivePrompt", prompt,
                    "width", width,
                    "height", height,
                    "model", "runware:101@1",
                    "numberResults", numberResults
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<List<Map<String, Object>>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                URL, HttpMethod.POST, entity, Map.class
            );

            Map<String, Object> responseBody = Objects.requireNonNull(response.getBody());
            System.out.println("Runware response: " + responseBody);

            List<Map<String, Object>> data = (List<Map<String, Object>>) responseBody.get("data");
            if (data != null && !data.isEmpty() && data.get(0).containsKey("imageURL")) {
                return (String) data.get(0).get("imageURL");
            }

            return "Error: no images returned from Runware. Full response: " + responseBody;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: failed to generate image – " + e.getMessage();
        }
    }

}
