package com.bestgroup.HomeEntertAInment.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Quiz Delete Request
 * Represents the request to delete a quiz
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizDeleteDto {
    
    /**
     * ID of the user making the request
     */
    private String userId;
}
