package com.bestgroup.HomeEntertAInment.controller;

import com.bestgroup.HomeEntertAInment.dto.story.StoryRequest;
import com.bestgroup.HomeEntertAInment.dto.story.StoryResponse;
import com.bestgroup.HomeEntertAInment.service.StoryService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/story")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StoryController {

    private final StoryService storyService;

    @PostMapping("/generate")
    @Operation(summary = "Generate a new story", description = "Generate a story based on the input provided.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Story generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public StoryResponse generateStory(@RequestBody StoryRequest storyRequest) {
        return storyService.generateStory(storyRequest);
    }
}
