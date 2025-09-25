package com.bestgroup.HomeEntertAInment.quiz.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

/**
 * Data Transfer Object for Quiz Response
 * Contains complete quiz data including questions with correct answers and explanations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResponseDto {
    
    /**
     * Unique identifier for the quiz
     */
    private String id;
    
    /**
     * Title of the quiz
     */
    private String title;
    
    /**
     * List of questions in the quiz (with correct answers and explanations)
     */
    private List<QuestionResponseDto> questions;
    
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
     * Description of the quiz
     */
    private String description;
}
