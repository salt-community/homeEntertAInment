package com.bestgroup.HomeEntertAInment.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

/**
 * Model representing a quiz question
 * Contains the question text, answer options, correct answer, and explanation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    
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
