package com.bestgroup.HomeEntertAInment.storybuilder.http;

import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.ImageRequest;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.ImageResponse;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.StoryRequest;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.StoryResponse;
import com.bestgroup.HomeEntertAInment.storybuilder.service.StoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/story")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StoryController {

    private final StoryService storyService;

    @PostMapping("/generate")
    @Operation(summary = "Generate a new story", description = "Generate a story based on the input provided.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Story generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<StoryResponse> generateStory(
            @RequestBody StoryRequest storyRequest,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            // Log the Authorization header for verification
            if (authorization != null) {
                log.info("Story generation request received with Authorization header: {}", 
                    authorization.startsWith("Bearer ") ? "Bearer [REDACTED]" : authorization);
            } else {
                log.warn("Story generation request received without Authorization header");
            }
            
            StoryResponse storyResponse = storyService.generateStory(storyRequest);
            log.info("Story generated successfully with title: {}", storyRequest.getTitle());
            return ResponseEntity.ok(storyResponse);
        } catch (IllegalArgumentException e) {
            log.error("Invalid input for story generation: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("Error generating story: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(null);
        }
    }


    @PostMapping("/image")
    @Operation(summary = "Generate a new story", description = "Generate a story based on the input provided.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Story generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ImageResponse> generateImage(@RequestBody ImageRequest iamgeRequest) {
        try {
            ImageResponse imageResponse = storyService.generateImage(iamgeRequest);
            System.out.println("imageResponse = " + imageResponse);
            return ResponseEntity.ok(imageResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

//    @PostMapping("/save-image")
//    public ResponseEntity<String> saveImage(@RequestBody String imageUrl) {
//        try {
//            byte[] imageBytes = restTemplate.getForObject(imageUrl, byte[].class);
//            Path path = Paths.get("saved-images/dragon.png");
//            Files.write(path, imageBytes);
//
//            return ResponseEntity.ok("Image saved at: " + path.toAbsolutePath());
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Failed to save image: " + e.getMessage());
//        }
//    }


}
