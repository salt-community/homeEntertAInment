package com.bestgroup.HomeEntertAInment.quiz.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Quiz Configuration
 * Represents the configuration data sent from frontend for quiz generation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizConfigurationDto {
    
    /**
     * Age group of the participants
     * Values: "children", "teen", "adult"
     */
    private String ageGroup;
    
    /**
     * List of topics for the quiz
     * Can include multiple topics like "Science", "History", etc.
     */
    private List<String> topics;
    
    /**
     * Difficulty level of the quiz
     * Values: "easy", "medium", "hard"
     */
    private String difficulty;
    
    /**
     * Number of questions in the quiz
     * Range: 5-15
     */
    private Integer questionCount;
    
    /**
     * ID of the user creating this quiz
     */
    private String userId;
    
    /**
     * Whether the quiz is private (not shown in public quiz list)
     * If true, quiz will not appear in getAllQuizzes() but can still be accessed via direct link
     */
    private Boolean isPrivate;
}
