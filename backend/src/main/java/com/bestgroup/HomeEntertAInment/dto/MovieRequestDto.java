package com.bestgroup.HomeEntertAInment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for movie recommendation requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequestDto {
    
    /**
     * Genre preferences for movie recommendations
     */
    private List<String> genres;
    
    /**
     * Age rating preference (e.g., "PG", "PG-13", "R")
     */
    private String ageRating;
    
    /**
     * Duration preference in minutes (e.g., 90, 120, 180)
     */
    private Integer duration;
    
    /**
     * Release decade preference (e.g., "1990s", "2000s", "2010s")
     */
    private String decade;
    
    /**
     * Mood or atmosphere preference
     */
    private String mood;
    
    /**
     * Custom description of what type of movie the user wants
     */
    private String customDescription;
}
