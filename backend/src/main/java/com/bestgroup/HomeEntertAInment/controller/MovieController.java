package com.bestgroup.HomeEntertAInment.controller;

import com.bestgroup.HomeEntertAInment.dto.MovieRequestDto;
import com.bestgroup.HomeEntertAInment.dto.MovieResponseDto;
import com.bestgroup.HomeEntertAInment.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for movie recommendation endpoints
 */
@CrossOrigin
@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    /**
     * Generate movie recommendations based on user preferences
     *
     * @param request The movie request containing user preferences
     * @return ResponseEntity containing movie recommendations
     */
    @PostMapping("/recommendations")
    @Operation(summary = "Generate movie recommendations", description = "Generate top 5 movie recommendations based on user preferences using AI.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Movie recommendations generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<MovieResponseDto> getMovieRecommendations(@RequestBody MovieRequestDto request) {
        try {
            MovieResponseDto response = movieService.generateMovieRecommendations(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
