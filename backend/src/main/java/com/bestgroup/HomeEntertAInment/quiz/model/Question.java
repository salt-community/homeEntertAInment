package com.bestgroup.HomeEntertAInment.quiz.model;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a quiz question
 * Contains the question text, answer options, correct answer, and explanation
 */
@Entity
@Table(name = "quiz_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    
    /**
     * Unique identifier for the question
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    /**
     * The question text
     */
    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;
    
    /**
     * List of possible answer options
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text", nullable = false)
    private List<String> options;
    
    /**
     * The correct answer (index in the options list)
     */
    @Column(name = "correct_answer_index", nullable = false)
    private Integer correctAnswerIndex;
    
    /**
     * Explanation for why the correct answer is right
     */
    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;
    
    /**
     * Topic/category of the question
     */
    @Column(name = "topic", nullable = false)
    private String topic;
    
    /**
     * Difficulty level of the question
     */
    @Column(name = "difficulty", nullable = false)
    private String difficulty;
    
    /**
     * Age group this question is appropriate for
     */
    @Column(name = "age_group", nullable = false)
    private String ageGroup;
    
    /**
     * Reference to the quiz this question belongs to
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
}
