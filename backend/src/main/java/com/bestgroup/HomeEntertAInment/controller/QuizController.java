package com.bestgroup.HomeEntertAInment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bestgroup.HomeEntertAInment.dto.QuizConfigurationDto;

import lombok.RequiredArgsConstructor;

/**
 * Controller for Quiz generation and management endpoints
 * Provides REST endpoints for creating and managing quizzes
 */
@CrossOrigin
@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    /**
     * Create a new quiz based on configuration
     * @param config The quiz configuration data from frontend
     * @return ResponseEntity indicating quiz creation status
     */
    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestBody QuizConfigurationDto config) {
        // TODO: Implement quiz creation logic
        // For now, just log the received configuration
        System.out.println("Received quiz configuration:");
        System.out.println("Age Group: " + config.getAgeGroup());
        System.out.println("Topics: " + config.getTopics());
        System.out.println("Difficulty: " + config.getDifficulty());
        System.out.println("Question Count: " + config.getQuestionCount());
        
        return ResponseEntity.ok("Quiz creation endpoint - configuration received successfully");
    }

    /**
     * Get quiz by ID
     * @param quizId The ID of the quiz to retrieve
     * @return ResponseEntity containing quiz data
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<String> getQuiz(@PathVariable String quizId) {
        // TODO: Implement quiz retrieval logic
        return ResponseEntity.ok("Get quiz endpoint - not implemented yet");
    }

    /**
     * Get all available quizzes
     * @return ResponseEntity containing list of quizzes
     */
    @GetMapping("/all")
    public ResponseEntity<String> getAllQuizzes() {
        // TODO: Implement get all quizzes logic
        return ResponseEntity.ok("Get all quizzes endpoint - not implemented yet");
    }

    /**
     * Submit quiz answers for scoring
     * @param quizId The ID of the quiz
     * @return ResponseEntity containing quiz results
     */
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<String> submitQuiz(@PathVariable String quizId) {
        // TODO: Implement quiz submission logic
        return ResponseEntity.ok("Submit quiz endpoint - not implemented yet");
    }

    /**
     * Delete a quiz by ID
     * @param quizId The ID of the quiz to delete
     * @return ResponseEntity indicating deletion status
     */
    @DeleteMapping("/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable String quizId) {
        // TODO: Implement quiz deletion logic
        return ResponseEntity.ok("Delete quiz endpoint - not implemented yet");
    }

    /**
     * Get quiz statistics
     * @return ResponseEntity containing quiz statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<String> getQuizStats() {
        // TODO: Implement quiz statistics logic
        return ResponseEntity.ok("Quiz stats endpoint - not implemented yet");
    }
}
