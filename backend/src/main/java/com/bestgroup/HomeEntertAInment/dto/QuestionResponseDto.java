package com.bestgroup.HomeEntertAInment.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

/**
 * Data Transfer Object for Question Response
 * Contains question data without sensitive information like correct answers or explanations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponseDto {
    
    /**
     * Unique identifier for the question
     */
    private String id;
    
    /**
     * The question text
     */
    private String questionText;
    
    /**
     * List of possible answer options
     */
    private List<String> options;
    
    /**
     * Topic/category of the question
     */
    private String topic;
    
    /**
     * Difficulty level of the question
     */
    private String difficulty;
    
    /**
     * Age group this question is appropriate for
     */
    private String ageGroup;
}
