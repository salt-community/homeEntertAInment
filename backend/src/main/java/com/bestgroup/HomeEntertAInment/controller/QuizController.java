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
import com.bestgroup.HomeEntertAInment.dto.QuizResponseDto;
import com.bestgroup.HomeEntertAInment.service.QuizService;

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

    private final QuizService quizService;

    /**
     * Create a new quiz based on configuration
     * @param config The quiz configuration data from frontend
     * @return ResponseEntity containing the generated quiz (with complete question data)
     */
    @PostMapping("/create")
    public ResponseEntity<QuizResponseDto> createQuiz(@RequestBody QuizConfigurationDto config) {
        try {
            // Generate quiz using the service
            QuizResponseDto generatedQuiz = quizService.generateQuiz(config);
            
            // Log the quiz creation
            System.out.println("Generated quiz: " + generatedQuiz.getTitle());
            System.out.println("Quiz ID: " + generatedQuiz.getId());
            System.out.println("Number of questions: " + generatedQuiz.getQuestions().size());
            
            return ResponseEntity.ok(generatedQuiz);
        } catch (Exception e) {
            System.err.println("Error generating quiz: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
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
