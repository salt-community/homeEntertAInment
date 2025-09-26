package com.bestgroup.HomeEntertAInment.quiz.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a complete quiz
 * Contains questions, metadata, and configuration used to create it
 */
@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {
    
    /**
     * Unique identifier for the quiz
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    /**
     * Title of the quiz
     */
    @Column(name = "title", nullable = false)
    private String title;
    
    /**
     * List of questions in the quiz
     */
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<Question> questions = new ArrayList<>();
    
    /**
     * Age group this quiz is designed for
     */
    @Column(name = "age_group", nullable = false)
    private String ageGroup;
    
    /**
     * Topics covered in this quiz
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "quiz_topics", joinColumns = @JoinColumn(name = "quiz_id"))
    @Column(name = "topic_name", nullable = false)
    private List<String> topics;
    
    /**
     * Difficulty level of the quiz
     */
    @Column(name = "difficulty", nullable = false)
    private String difficulty;
    
    /**
     * Number of questions in the quiz
     */
    @Column(name = "question_count", nullable = false)
    private Integer questionCount;
    
    /**
     * Timestamp when the quiz was created
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * Description of the quiz
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    /**
     * ID of the user who created this quiz
     */
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    /**
     * Whether the quiz is private (not shown in public quiz list)
     */
    @Column(name = "is_private", nullable = false)
    @Builder.Default
    private Boolean isPrivate = false;
}
