package com.bestgroup.HomeEntertAInment.quiz.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

/**
 * Data Transfer Object for Question Response
 * Contains complete question data including correct answers and explanations
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
     * The correct answer (index in the options list)
     */
    private Integer correctAnswerIndex;
    
    /**
     * Explanation for why the correct answer is right
     */
    private String explanation;
    
    /**
     * Difficulty level of the question
     */
    private String difficulty;
    
    /**
     * Age group this question is appropriate for
     */
    private String ageGroup;
}
