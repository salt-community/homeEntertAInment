package com.bestgroup.HomeEntertAInment.quiz.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bestgroup.HomeEntertAInment.quiz.model.Quiz;

/**
 * Repository interface for Quiz entity
 * Provides CRUD operations and custom queries for quiz management
 */
@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    
    /**
     * Find all quizzes by age group
     * @param ageGroup The age group to filter by
     * @return List of quizzes for the specified age group
     */
    List<Quiz> findByAgeGroup(String ageGroup);
    
    /**
     * Find all quizzes by difficulty level
     * @param difficulty The difficulty level to filter by
     * @return List of quizzes with the specified difficulty
     */
    List<Quiz> findByDifficulty(String difficulty);
    
    /**
     * Find all quizzes by age group and difficulty
     * @param ageGroup The age group to filter by
     * @param difficulty The difficulty level to filter by
     * @return List of quizzes matching both criteria
     */
    List<Quiz> findByAgeGroupAndDifficulty(String ageGroup, String difficulty);
    
    /**
     * Find quizzes that contain specific topics
     * @param topic The topic to search for
     * @return List of quizzes containing the specified topic
     */
    @Query("SELECT q FROM Quiz q WHERE q.topics LIKE %:topic%")
    List<Quiz> findByTopicsContaining(@Param("topic") String topic);
    
    /**
     * Find a quiz by ID with all its questions loaded
     * @param id The quiz ID
     * @return Optional containing the quiz with questions, or empty if not found
     */
    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions WHERE q.id = :id")
    Optional<Quiz> findByIdWithQuestions(@Param("id") UUID id);
    
    /**
     * Find all quizzes with their questions loaded
     * @return List of all quizzes with questions
     */
    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions")
    List<Quiz> findAllWithQuestions();
    
    /**
     * Count quizzes by age group
     * @param ageGroup The age group to count
     * @return Number of quizzes for the specified age group
     */
    long countByAgeGroup(String ageGroup);
    
    /**
     * Count quizzes by difficulty
     * @param difficulty The difficulty level to count
     * @return Number of quizzes with the specified difficulty
     */
    long countByDifficulty(String difficulty);
}
