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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<StoryResponse> generateStory(@RequestBody StoryRequest storyRequest) {
        try {
            StoryResponse storyResponse = storyService.generateStory(storyRequest);
            return ResponseEntity.ok(storyResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
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
