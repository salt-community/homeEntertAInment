package com.bestgroup.HomeEntertAInment.quiz.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bestgroup.HomeEntertAInment.quiz.dto.QuestionResponseDto;
import com.bestgroup.HomeEntertAInment.quiz.dto.QuizConfigurationDto;
import com.bestgroup.HomeEntertAInment.quiz.dto.QuizResponseDto;
import com.bestgroup.HomeEntertAInment.quiz.model.Question;
import com.bestgroup.HomeEntertAInment.quiz.model.Quiz;
import com.bestgroup.HomeEntertAInment.quiz.repository.QuizRepository;
import com.bestgroup.HomeEntertAInment.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for quiz generation and management
 * Handles creating quizzes based on configuration and managing quiz data
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class QuizService {

    private final GeminiService geminiService;
    private final QuizRepository quizRepository;
    private ObjectMapper objectMapper;
    
    @PostConstruct
    public void init() {
        this.objectMapper = new ObjectMapper();
        // Register JavaTimeModule to handle Java 8 time types (LocalDateTime, etc.)
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Generate a quiz based on the provided configuration
     * @param config The quiz configuration from the frontend
     * @return Generated quiz response DTO (with complete question data)
     */
    @Transactional
    public QuizResponseDto generateQuiz(QuizConfigurationDto config) {
        Quiz quiz = generateQuizInternal(config);
        
        // Only save the quiz to the database if it's not a mock quiz
        if (isMockQuiz(quiz)) {
            log.info("Skipping database save for mock quiz: {}", quiz.getTitle());
            return convertToResponseDto(quiz);
        } else {
            // Save the quiz to the database
            Quiz savedQuiz = quizRepository.save(quiz);
            return convertToResponseDto(savedQuiz);
        }
    }
    
    /**
     * Get a quiz by ID
     * @param id The quiz ID
     * @return Optional containing the quiz response DTO, or empty if not found
     */
    public Optional<QuizResponseDto> getQuizById(UUID id) {
        return quizRepository.findByIdWithQuestions(id)
                .map(this::convertToResponseDto);
    }
    
    /**
     * Get all quizzes
     * @return List of all quiz response DTOs
     */
    public List<QuizResponseDto> getAllQuizzes() {
        return quizRepository.findAllWithQuestions().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Delete a quiz by ID
     * @param id The quiz ID to delete
     * @return true if the quiz was deleted, false if not found
     */
    @Transactional
    public boolean deleteQuiz(UUID id) {
        if (quizRepository.existsById(id)) {
            quizRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Internal method to generate the full quiz model using Gemini API
     * @param config The quiz configuration from the frontend
     * @return Generated quiz with questions (including correct answers)
     */
    private Quiz generateQuizInternal(QuizConfigurationDto config) {
        try {
            log.info("Generating quiz using Gemini API for configuration: {}", config);
            
            // Call Gemini API to generate quiz
            String quizJson = geminiService.sendQuizPrompt(config);
            
            // Parse JSON response to Quiz model
            Quiz generatedQuiz = parseQuizFromJson(quizJson);
            
            // Set the current timestamp and user ID
            generatedQuiz.setCreatedAt(LocalDateTime.now());
            generatedQuiz.setUserId(config.getUserId());
            
            log.info("Successfully generated quiz with title: '{}' and {} questions for user: {}", 
                    generatedQuiz.getTitle(), generatedQuiz.getQuestions().size(), config.getUserId());
            
            return generatedQuiz;
            
        } catch (Exception e) {
            log.error("Failed to generate quiz using Gemini API, falling back to mock data", e);
            
            // Fallback to mock data if Gemini API fails
            return generateMockQuiz(config);
        }
    }

    /**
     * Parse JSON response from Gemini API into Quiz model
     * @param quizJson JSON string from Gemini API
     * @return Parsed Quiz model
     * @throws Exception if parsing fails
     */
    private Quiz parseQuizFromJson(String quizJson) throws Exception {
        try {
            // Clean the JSON response (remove any markdown formatting if present)
            String cleanJson = quizJson.trim();
            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.substring(7);
            }
            if (cleanJson.endsWith("```")) {
                cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
            }
            cleanJson = cleanJson.trim();
            
            log.debug("Parsing quiz JSON: {}", cleanJson);
            
            // Parse JSON to Quiz model
            Quiz quiz = objectMapper.readValue(cleanJson, Quiz.class);
            
            // Establish bidirectional relationship between quiz and questions
            if (quiz.getQuestions() != null) {
                for (Question question : quiz.getQuestions()) {
                    question.setQuiz(quiz);
                }
            }
            
            // Validate the parsed quiz
            validateQuiz(quiz);
            
            return quiz;
            
        } catch (Exception e) {
            log.error("Failed to parse quiz JSON: {}", quizJson, e);
            throw new Exception("Failed to parse quiz from Gemini API response: " + e.getMessage(), e);
        }
    }

    /**
     * Validate the parsed quiz to ensure it has required fields
     * @param quiz The quiz to validate
     * @throws Exception if validation fails
     */
    private void validateQuiz(Quiz quiz) throws Exception {
        if (quiz == null) {
            throw new Exception("Quiz object is null");
        }
        // Note: ID will be generated by JPA when saving to database
        if (quiz.getTitle() == null || quiz.getTitle().trim().isEmpty()) {
            throw new Exception("Quiz title is missing or empty");
        }
        if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            throw new Exception("Quiz has no questions");
        }
        if (quiz.getQuestions().size() != quiz.getQuestionCount()) {
            log.warn("Question count mismatch: expected {}, got {}", 
                    quiz.getQuestionCount(), quiz.getQuestions().size());
        }
        
        // Validate each question
        for (int i = 0; i < quiz.getQuestions().size(); i++) {
            Question question = quiz.getQuestions().get(i);
            if (question == null) {
                throw new Exception("Question " + i + " is null");
            }
            if (question.getQuestionText() == null || question.getQuestionText().trim().isEmpty()) {
                throw new Exception("Question " + i + " text is missing or empty");
            }
            if (question.getOptions() == null || question.getOptions().isEmpty()) {
                throw new Exception("Question " + i + " options are missing or empty");
            }
            if (question.getOptions().size() != 4) {
                throw new Exception("Question " + i + " must have exactly 4 options");
            }
            if (question.getCorrectAnswerIndex() == null || 
                question.getCorrectAnswerIndex() < 0 || 
                question.getCorrectAnswerIndex() > 3) {
                throw new Exception("Question " + i + " has invalid correct answer index");
            }
        }
    }

    /**
     * Generate a mock quiz as fallback when Gemini API fails
     * @param config The quiz configuration to get user ID from
     * @return Mock quiz with sample questions
     */
    private Quiz generateMockQuiz(QuizConfigurationDto config) {
        log.info("Generating fallback sample quiz - Quiz generator is down");
        
        // Create a simple fallback quiz indicating the generator is down
        Quiz quiz = Quiz.builder()
                .title("Sample Quiz - Quiz Generator Temporarily Unavailable")
                .ageGroup("general")
                .topics(Arrays.asList("General Knowledge"))
                .difficulty("medium")
                .questionCount(3)
                .description("The quiz generator is currently down. This is a sample quiz to demonstrate the functionality.")
                .userId(config.getUserId() != null ? config.getUserId() : "system") // Use provided user ID or default to system
                .build();
        
        // Generate simple sample questions
        List<Question> questions = getSampleQuestions();
        for (Question question : questions) {
            question.setQuiz(quiz);
        }
        quiz.setQuestions(questions);
        
        return quiz;
    }

    /**
     * Get simple sample questions for the fallback quiz
     * @return List of sample questions
     */
    private List<Question> getSampleQuestions() {
        List<Question> questions = new ArrayList<>();
        
        questions.add(Question.builder()
                .questionText("What is the capital of France?")
                .options(Arrays.asList("London", "Berlin", "Paris", "Madrid"))
                .correctAnswerIndex(2)
                .explanation("Paris is the capital and largest city of France.")
                .topic("General Knowledge")
                .difficulty("medium")
                .ageGroup("general")
                .build());
        
        questions.add(Question.builder()
                .questionText("How many sides does a triangle have?")
                .options(Arrays.asList("2", "3", "4", "5"))
                .correctAnswerIndex(1)
                .explanation("A triangle is a polygon with exactly three sides.")
                .topic("General Knowledge")
                .difficulty("easy")
                .ageGroup("general")
                .build());
        
        questions.add(Question.builder()
                .questionText("What is the largest planet in our solar system?")
                .options(Arrays.asList("Earth", "Saturn", "Jupiter", "Neptune"))
                .correctAnswerIndex(2)
                .explanation("Jupiter is the largest planet in our solar system, more than twice as massive as all other planets combined.")
                .topic("General Knowledge")
                .difficulty("medium")
                .ageGroup("general")
                .build());
        
        return questions;
    }

    /**
     * Check if a quiz is a mock quiz (fallback quiz)
     * @param quiz The quiz to check
     * @return true if it's a mock quiz, false otherwise
     */
    private boolean isMockQuiz(Quiz quiz) {
        return quiz.getTitle() != null && 
               quiz.getTitle().contains("Sample Quiz - Quiz Generator Temporarily Unavailable");
    }

    /**
     * Convert Quiz model to QuizResponseDto (with complete question data)
     * @param quiz The quiz model to convert
     * @return QuizResponseDto with all question information
     */
    private QuizResponseDto convertToResponseDto(Quiz quiz) {
        List<QuestionResponseDto> questionDtos = quiz.getQuestions().stream()
                .map(this::convertQuestionToResponseDto)
                .collect(Collectors.toList());

        return QuizResponseDto.builder()
                .id(quiz.getId().toString())
                .title(quiz.getTitle())
                .questions(questionDtos)
                .ageGroup(quiz.getAgeGroup())
                .topics(quiz.getTopics())
                .difficulty(quiz.getDifficulty())
                .description(quiz.getDescription())
                .build();
    }

    /**
     * Convert Question model to QuestionResponseDto (with correct answer and explanation)
     * @param question The question model to convert
     * @return QuestionResponseDto with complete question data
     */
    private QuestionResponseDto convertQuestionToResponseDto(Question question) {
        return QuestionResponseDto.builder()
                .id(question.getId().toString())
                .questionText(question.getQuestionText())
                .options(question.getOptions())
                .correctAnswerIndex(question.getCorrectAnswerIndex())
                .explanation(question.getExplanation())
                .difficulty(question.getDifficulty())
                .ageGroup(question.getAgeGroup())
                .build();
    }

}
