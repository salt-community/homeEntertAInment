package com.bestgroup.HomeEntertAInment.controller;

import com.bestgroup.HomeEntertAInment.dto.story.StoryRequest;
import com.bestgroup.HomeEntertAInment.dto.story.StoryResponse;
import com.bestgroup.HomeEntertAInment.service.StoryService;
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

}
