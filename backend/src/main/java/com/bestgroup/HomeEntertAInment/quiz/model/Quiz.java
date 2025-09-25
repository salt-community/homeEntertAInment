package com.bestgroup.HomeEntertAInment.quiz.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Model representing a complete quiz
 * Contains questions, metadata, and configuration used to create it
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {
    
    /**
     * Unique identifier for the quiz
     */
    private String id;
    
    /**
     * Title of the quiz
     */
    private String title;
    
    /**
     * List of questions in the quiz
     */
    private List<Question> questions;
    
    /**
     * Age group this quiz is designed for
     */
    private String ageGroup;
    
    /**
     * Topics covered in this quiz
     */
    private List<String> topics;
    
    /**
     * Difficulty level of the quiz
     */
    private String difficulty;
    
    /**
     * Number of questions in the quiz
     */
    private Integer questionCount;
    
    /**
     * Timestamp when the quiz was created
     */
    private LocalDateTime createdAt;
    
    /**
     * Description of the quiz
     */
    private String description;
}
