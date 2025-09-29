package com.bestgroup.HomeEntertAInment.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Quiz Privacy Update
 * Represents the request to update a quiz's privacy setting
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizPrivacyUpdateDto {
    
    /**
     * ID of the user making the request
     */
    private String userId;
    
    /**
     * Whether the quiz should be private
     */
    private Boolean isPrivate;
}
