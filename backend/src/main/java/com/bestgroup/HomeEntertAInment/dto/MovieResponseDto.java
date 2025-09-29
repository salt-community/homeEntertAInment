package com.bestgroup.HomeEntertAInment.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for movie recommendation responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponseDto {
    
    /**
     * List of recommended movies
     */
    private List<MovieDto> movies;
    
    /**
     * DTO representing a single movie recommendation
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MovieDto {
        
        /**
         * Title of the movie
         */
        private String title;
        
        /**
         * Year of release
         */
        private Integer year;
        
        /**
         * IMDb ID
         */
        private String imdbId;
        
        /**
         * Movie genres
         */
        private List<String> genres;
        
        /**
         * Brief description or synopsis
         */
        private String description;
        
        /**
         * Duration in minutes
         */
        private Integer duration;
        
        /**
         * Age rating (PG, PG-13, R, etc.)
         */
        private String ageRating;
        
        /**
         * Director name
         */
        @JsonDeserialize(using = DirectorDeserializer.class)
        private String director;
        
        /**
         * Main cast members
         */
        private List<String> cast;
        
        /**
         * IMDb or similar rating (e.g., 8.5)
         */
        private Double rating;
        
        /**
         * Why this movie was recommended based on user preferences
         */
        private String recommendationReason;
    }
}
