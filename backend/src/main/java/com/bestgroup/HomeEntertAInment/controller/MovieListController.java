package com.bestgroup.HomeEntertAInment.controller;

import com.bestgroup.HomeEntertAInment.dto.MovieResponseDto;
import com.bestgroup.HomeEntertAInment.dto.MovieListSummaryDto;
import com.bestgroup.HomeEntertAInment.dto.MovieListDetailDto;
import com.bestgroup.HomeEntertAInment.entity.MovieList;
import com.bestgroup.HomeEntertAInment.service.MovieListService;
import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    private final ObjectMapper objectMapper;

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
    public ResponseEntity<List<MovieListSummaryDto>> getUserMovieLists(
            Authentication authentication
    ) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            List<MovieList> movieLists = movieListService.getMovieListsByUserId(clerkUserId);
            List<MovieListSummaryDto> summaryDtos = movieLists.stream()
                    .map(this::convertToSummaryDto)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(summaryDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{listId}")
    public ResponseEntity<MovieListDetailDto> getMovieList(
            @PathVariable Long listId,
            Authentication authentication
    ) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            Optional<MovieList> movieList = movieListService.getMovieListByIdAndUserId(listId, clerkUserId);
            return movieList.map(this::convertToDetailDto)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
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
        if (moviesData == null || !moviesData.containsKey("movies")) {
            return new MovieResponseDto();
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> moviesList = (List<Map<String, Object>>) moviesData.get("movies");
        
        List<MovieResponseDto.MovieDto> movieDtos = moviesList.stream()
                .map(this::convertToMovieDto)
                .collect(java.util.stream.Collectors.toList());
        
        return MovieResponseDto.builder()
                .movies(movieDtos)
                .build();
    }
    
    private MovieResponseDto.MovieDto convertToMovieDto(Map<String, Object> movieData) {
        @SuppressWarnings("unchecked")
        List<String> genres = movieData.get("genres") != null ? 
                (List<String>) movieData.get("genres") : new java.util.ArrayList<>();
        
        @SuppressWarnings("unchecked")
        List<String> cast = movieData.get("cast") != null ? 
                (List<String>) movieData.get("cast") : new java.util.ArrayList<>();
        
        return MovieResponseDto.MovieDto.builder()
                .title((String) movieData.get("title"))
                .year(movieData.get("year") != null ? ((Number) movieData.get("year")).intValue() : null)
                .imdbId((String) movieData.get("imdbId"))
                .genres(genres)
                .description((String) movieData.get("description"))
                .duration(movieData.get("duration") != null ? ((Number) movieData.get("duration")).intValue() : null)
                .ageRating((String) movieData.get("ageRating"))
                .director((String) movieData.get("director"))
                .cast(cast)
                .rating(movieData.get("rating") != null ? ((Number) movieData.get("rating")).doubleValue() : null)
                .recommendationReason((String) movieData.get("recommendationReason"))
                .build();
    }
    
    private MovieListSummaryDto convertToSummaryDto(MovieList movieList) {
        return MovieListSummaryDto.builder()
                .id(movieList.getId())
                .listName(movieList.getListName())
                .description(movieList.getDescription())
                .movieCount(movieList.getMovies() != null ? movieList.getMovies().size() : 0)
                .createdAt(movieList.getCreatedAt())
                .build();
    }
    
    private MovieListDetailDto convertToDetailDto(MovieList movieList) {
        List<MovieResponseDto.MovieDto> movieDtos = movieList.getMovies() != null ?
                movieList.getMovies().stream()
                        .map(this::convertToMovieDto)
                        .collect(java.util.stream.Collectors.toList()) :
                new java.util.ArrayList<>();
        
        return MovieListDetailDto.builder()
                .id(movieList.getId())
                .listName(movieList.getListName())
                .description(movieList.getDescription())
                .searchCriteria(movieList.getSearchCriteria())
                .createdAt(movieList.getCreatedAt())
                .movies(movieDtos)
                .build();
    }
    
    private MovieResponseDto.MovieDto convertToMovieDto(com.bestgroup.HomeEntertAInment.entity.MovieListItem movieItem) {
        try {
            List<String> genres = movieItem.getGenres() != null ?
                    objectMapper.readValue(movieItem.getGenres(), 
                            objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)) :
                    new java.util.ArrayList<>();
            
            List<String> cast = movieItem.getCast() != null ?
                    objectMapper.readValue(movieItem.getCast(), 
                            objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)) :
                    new java.util.ArrayList<>();
            
            return MovieResponseDto.MovieDto.builder()
                    .title(movieItem.getTitle())
                    .year(movieItem.getYear())
                    .imdbId(movieItem.getImdbId())
                    .genres(genres)
                    .description(movieItem.getDescription())
                    .duration(movieItem.getDuration())
                    .ageRating(movieItem.getAgeRating())
                    .director(movieItem.getDirector())
                    .cast(cast)
                    .rating(movieItem.getRating())
                    .recommendationReason(movieItem.getRecommendationReason())
                    .build();
        } catch (Exception e) {
            // Fallback if JSON parsing fails
            return MovieResponseDto.MovieDto.builder()
                    .title(movieItem.getTitle())
                    .description(movieItem.getDescription())
                    .build();
        }
    }
}
