package com.bestgroup.HomeEntertAInment.controller;

import com.bestgroup.HomeEntertAInment.dto.MovieResponseDto;
import com.bestgroup.HomeEntertAInment.entity.MovieList;
import com.bestgroup.HomeEntertAInment.service.MovieListService;
import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/movie-lists")
@RequiredArgsConstructor
public class MovieListController {

    private final MovieListService movieListService;
    private final ClerkUserExtractor clerkUserExtractor;

    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveMovieList(
            @RequestBody Map<String, Object> request,
            Authentication authentication
    ) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            
            String listName = (String) request.get("listName");
            String description = (String) request.get("description");
            String searchCriteria = (String) request.get("searchCriteria");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> moviesData = (Map<String, Object>) request.get("movies");
            MovieResponseDto movieResponse = convertToMovieResponseDto(moviesData);
            
            MovieList savedList = movieListService.saveMovieList(
                clerkUserId, 
                listName, 
                description, 
                searchCriteria, 
                movieResponse
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Movie list saved successfully");
            response.put("listId", savedList.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to save movie list: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<List<MovieList>> getUserMovieLists(
            Authentication authentication
    ) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            List<MovieList> movieLists = movieListService.getMovieListsByUserId(clerkUserId);
            return ResponseEntity.ok(movieLists);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{listId}")
    public ResponseEntity<MovieList> getMovieList(
            @PathVariable Long listId,
            Authentication authentication
    ) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            Optional<MovieList> movieList = movieListService.getMovieListByIdAndUserId(listId, clerkUserId);
            return movieList.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<Map<String, Object>> deleteMovieList(
            @PathVariable Long listId,
            Authentication authentication
    ) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            movieListService.deleteMovieList(listId, clerkUserId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Movie list deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete movie list: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    private MovieResponseDto convertToMovieResponseDto(Map<String, Object> moviesData) {
        // Simple conversion - in a real app you'd use proper DTO mapping
        MovieResponseDto responseDto = new MovieResponseDto();
        // This is a simplified conversion - you might want to use MapStruct or similar
        return responseDto;
    }
}
