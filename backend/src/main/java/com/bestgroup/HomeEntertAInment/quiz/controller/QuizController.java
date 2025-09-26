package com.bestgroup.HomeEntertAInment.quiz.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bestgroup.HomeEntertAInment.quiz.dto.QuizConfigurationDto;
import com.bestgroup.HomeEntertAInment.quiz.dto.QuizResponseDto;
import com.bestgroup.HomeEntertAInment.quiz.service.QuizService;

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
    public ResponseEntity<QuizResponseDto> getQuiz(@PathVariable UUID quizId) {
        Optional<QuizResponseDto> quiz = quizService.getQuizById(quizId);
        return quiz.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all available quizzes
     * @return ResponseEntity containing list of quizzes
     */
    @GetMapping("/all")
    public ResponseEntity<List<QuizResponseDto>> getAllQuizzes() {
        List<QuizResponseDto> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    /**
     * Get all quizzes created by a specific user
     * @param userId The ID of the user who created the quizzes
     * @return ResponseEntity containing list of quizzes created by the user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuizResponseDto>> getQuizzesByUserId(@PathVariable String userId) {
        List<QuizResponseDto> quizzes = quizService.getQuizzesByUserId(userId);
        return ResponseEntity.ok(quizzes);
    }

    /**
     * Submit quiz answers for scoring
     * @param quizId The ID of the quiz
     * @return ResponseEntity containing quiz results
     */
    @PostMapping("/{quizId}/submit")
    public ResponseEntity<String> submitQuiz(@PathVariable UUID quizId) {
        // TODO: Implement quiz submission logic
        return ResponseEntity.ok("Submit quiz endpoint - not implemented yet");
    }

    /**
     * Delete a quiz by ID
     * @param quizId The ID of the quiz to delete
     * @return ResponseEntity indicating deletion status
     */
    @DeleteMapping("/{quizId}")
    public ResponseEntity<String> deleteQuiz(@PathVariable UUID quizId) {
        boolean deleted = quizService.deleteQuiz(quizId);
        if (deleted) {
            return ResponseEntity.ok("Quiz deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
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
