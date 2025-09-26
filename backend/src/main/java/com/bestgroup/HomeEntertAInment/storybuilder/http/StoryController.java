package com.bestgroup.HomeEntertAInment.storybuilder.http;

import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.*;
import com.bestgroup.HomeEntertAInment.storybuilder.service.StoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StoryController {

    private final StoryService storyService;

    @PostMapping("/story/generate")
    @Operation(summary = "Generate a new story", description = "Generate a story based on the input provided.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Story generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<StoryResponse> generateStory(
        @RequestBody StoryRequest storyRequest,
        Authentication authentication) {
        try {
            StoryResponse storyResponse = storyService.generateStory(storyRequest, authentication);
            log.info("Story generated successfully with title: {}", storyRequest.character());
            return ResponseEntity.ok(storyResponse);
        } catch (IllegalArgumentException e) {
            log.error("Invalid input for story generation: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            log.error("Error generating story: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(null);
        }
    }


    @PostMapping("/story/image")
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

    // Story persistence endpoints

    @GetMapping("/stories")
    @Operation(summary = "Get all stories for the current user", description = "Retrieve all stories created by the authenticated user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stories retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<List<StoryDto>> getStories(Authentication authentication) {
        try {
            List<StoryDto> stories = storyService.getStoriesForUser(authentication);
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error retrieving stories: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/stories/{id}")
    @Operation(summary = "Get a specific story by ID", description = "Retrieve a specific story by ID for the authenticated user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Story retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Story not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<StoryDto> getStory(@PathVariable UUID id, Authentication authentication) {
        try {
            Optional<StoryDto> story = storyService.getStoryById(id, authentication);
            return story.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error retrieving story: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/stories")
    @Operation(summary = "Create a new story", description = "Create a new story for the authenticated user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Story created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<StoryDto> createStory(@RequestBody CreateStoryRequest request, Authentication authentication) {
        try {
            StoryDto story = storyService.createStory(request, authentication);
            return ResponseEntity.ok(story);
        } catch (IllegalArgumentException e) {
            log.error("Invalid input for story creation: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error creating story: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/stories/{id}")
    @Operation(summary = "Update an existing story", description = "Update an existing story for the authenticated user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Story updated successfully"),
        @ApiResponse(responseCode = "404", description = "Story not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<StoryDto> updateStory(@PathVariable UUID id, @RequestBody UpdateStoryRequest request, Authentication authentication) {
        try {
            // Ensure the ID in the path matches the ID in the request body
            UpdateStoryRequest requestWithId = new UpdateStoryRequest(
                id,
                request.character(),
                request.theme(),
                request.ageGroup(),
                request.storyLength(),
                request.twist(),
                request.custom(),
                request.coverImageUrl()
            );

            Optional<StoryDto> story = storyService.updateStory(requestWithId, authentication);
            return story.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.error("Invalid input for story update: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error updating story: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/stories/{id}")
    @Operation(summary = "Delete a story", description = "Delete a story for the authenticated user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Story deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Story not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteStory(@PathVariable UUID id, Authentication authentication) {
        try {
            boolean deleted = storyService.deleteStory(id, authentication);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting story: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
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
