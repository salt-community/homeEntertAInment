package com.bestgroup.HomeEntertAInment.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bestgroup.HomeEntertAInment.dto.QuestionResponseDto;
import com.bestgroup.HomeEntertAInment.dto.QuizConfigurationDto;
import com.bestgroup.HomeEntertAInment.dto.QuizResponseDto;
import com.bestgroup.HomeEntertAInment.model.Question;
import com.bestgroup.HomeEntertAInment.model.Quiz;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for quiz generation and management
 * Handles creating quizzes based on configuration and managing quiz data
 */
@Service
@Slf4j
public class QuizService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;
    
    public QuizService(GeminiService geminiService) {
        this.geminiService = geminiService;
        this.objectMapper = new ObjectMapper();
        // Register JavaTimeModule to handle Java 8 time types (LocalDateTime, etc.)
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Generate a quiz based on the provided configuration
     * @param config The quiz configuration from the frontend
     * @return Generated quiz response DTO (with complete question data)
     */
    public QuizResponseDto generateQuiz(QuizConfigurationDto config) {
        Quiz quiz = generateQuizInternal(config);
        return convertToResponseDto(quiz);
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
            
            // Set the current timestamp
            generatedQuiz.setCreatedAt(LocalDateTime.now());
            
            log.info("Successfully generated quiz with ID: {} and {} questions", 
                    generatedQuiz.getId(), generatedQuiz.getQuestions().size());
            
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
        if (quiz.getId() == null || quiz.getId().trim().isEmpty()) {
            throw new Exception("Quiz ID is missing or empty");
        }
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
            if (question.getOptions() == null || question.getOptions().size() != 4) {
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
     * @param config The quiz configuration
     * @return Mock quiz with sample questions
     */
    private Quiz generateMockQuiz(QuizConfigurationDto config) {
        log.info("Generating mock quiz as fallback for configuration: {}", config);
        
        // Generate quiz ID
        String quizId = "quiz_mock_" + System.currentTimeMillis();
        
        // Create quiz title based on configuration
        String title = createQuizTitle(config);
        
        // Generate questions based on configuration
        List<Question> questions = generateQuestions(config);
        
        // Create and return the quiz
        return Quiz.builder()
                .id(quizId)
                .title(title)
                .questions(questions)
                .ageGroup(config.getAgeGroup())
                .topics(config.getTopics())
                .difficulty(config.getDifficulty())
                .questionCount(config.getQuestionCount())
                .createdAt(LocalDateTime.now())
                .description(createQuizDescription(config))
                .build();
    }

    /**
     * Generate questions based on the quiz configuration
     * @param config The quiz configuration
     * @return List of questions
     */
    private List<Question> generateQuestions(QuizConfigurationDto config) {
        List<Question> allQuestions = getAllMockQuestions();
        
        // Filter questions by age group, topics, and difficulty
        List<Question> filteredQuestions = allQuestions.stream()
                .filter(q -> q.getAgeGroup().equals(config.getAgeGroup()))
                .filter(q -> config.getTopics().contains(q.getTopic()))
                .filter(q -> q.getDifficulty().equals(config.getDifficulty()))
                .collect(Collectors.toList());
        
        // If we don't have enough questions, add some from other topics
        if (filteredQuestions.size() < config.getQuestionCount()) {
            List<Question> additionalQuestions = allQuestions.stream()
                    .filter(q -> q.getAgeGroup().equals(config.getAgeGroup()))
                    .filter(q -> q.getDifficulty().equals(config.getDifficulty()))
                    .filter(q -> !config.getTopics().contains(q.getTopic()))
                    .collect(Collectors.toList());
            
            filteredQuestions.addAll(additionalQuestions);
        }
        
        // Shuffle and limit to requested count
        Collections.shuffle(filteredQuestions);
        return filteredQuestions.stream()
                .limit(config.getQuestionCount())
                .collect(Collectors.toList());
    }

    /**
     * Create a descriptive title for the quiz
     * @param config The quiz configuration
     * @return Quiz title
     */
    private String createQuizTitle(QuizConfigurationDto config) {
        String topicsStr = String.join(", ", config.getTopics());
        return String.format("%s %s Quiz - %s", 
                capitalizeFirst(config.getAgeGroup()), 
                capitalizeFirst(config.getDifficulty()), 
                topicsStr);
    }

    /**
     * Create a description for the quiz
     * @param config The quiz configuration
     * @return Quiz description
     */
    private String createQuizDescription(QuizConfigurationDto config) {
        return String.format("A %s difficulty quiz with %d questions covering %s topics, designed for %s.",
                config.getDifficulty(),
                config.getQuestionCount(),
                config.getTopics().size(),
                config.getAgeGroup());
    }

    /**
     * Get all available mock questions
     * @return List of all mock questions
     */
    private List<Question> getAllMockQuestions() {
        List<Question> questions = new ArrayList<>();
        
        // Science questions
        questions.addAll(getScienceQuestions());
        questions.addAll(getHistoryQuestions());
        questions.addAll(getGeographyQuestions());
        questions.addAll(getGeneralKnowledgeQuestions());
        
        return questions;
    }

    /**
     * Get science-related questions
     * @return List of science questions
     */
    private List<Question> getScienceQuestions() {
        List<Question> questions = new ArrayList<>();
        
        // Children Science Questions
        questions.add(Question.builder()
                .id("sci_001")
                .questionText("What do plants need to make their own food?")
                .options(Arrays.asList("Water and soil", "Sunlight and water", "Air and soil", "Sunlight, water, and air"))
                .correctAnswerIndex(3)
                .explanation("Plants use sunlight, water, and carbon dioxide from the air to make their own food through photosynthesis.")
                .topic("Science")
                .difficulty("easy")
                .ageGroup("children")
                .build());
        
        questions.add(Question.builder()
                .id("sci_002")
                .questionText("Which planet is closest to the Sun?")
                .options(Arrays.asList("Venus", "Mercury", "Earth", "Mars"))
                .correctAnswerIndex(1)
                .explanation("Mercury is the closest planet to the Sun in our solar system.")
                .topic("Science")
                .difficulty("easy")
                .ageGroup("children")
                .build());
        
        // Teen Science Questions
        questions.add(Question.builder()
                .id("sci_003")
                .questionText("What is the chemical symbol for gold?")
                .options(Arrays.asList("Go", "Gd", "Au", "Ag"))
                .correctAnswerIndex(2)
                .explanation("The chemical symbol for gold is Au, derived from the Latin word 'aurum'.")
                .topic("Science")
                .difficulty("medium")
                .ageGroup("teen")
                .build());
        
        questions.add(Question.builder()
                .id("sci_004")
                .questionText("What type of bond forms between a metal and a non-metal?")
                .options(Arrays.asList("Covalent", "Ionic", "Metallic", "Hydrogen"))
                .correctAnswerIndex(1)
                .explanation("Ionic bonds form between metals and non-metals when electrons are transferred from the metal to the non-metal.")
                .topic("Science")
                .difficulty("hard")
                .ageGroup("teen")
                .build());
        
        // Adult Science Questions
        questions.add(Question.builder()
                .id("sci_005")
                .questionText("What is the Heisenberg Uncertainty Principle?")
                .options(Arrays.asList("Energy cannot be created or destroyed", "You cannot simultaneously know the exact position and momentum of a particle", "Light behaves as both wave and particle", "Matter and energy are equivalent"))
                .correctAnswerIndex(1)
                .explanation("The Heisenberg Uncertainty Principle states that the more precisely you know a particle's position, the less precisely you can know its momentum, and vice versa.")
                .topic("Science")
                .difficulty("hard")
                .ageGroup("adult")
                .build());
        
        return questions;
    }

    /**
     * Get history-related questions
     * @return List of history questions
     */
    private List<Question> getHistoryQuestions() {
        List<Question> questions = new ArrayList<>();
        
        // Children History Questions
        questions.add(Question.builder()
                .id("hist_001")
                .questionText("Who was the first President of the United States?")
                .options(Arrays.asList("Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"))
                .correctAnswerIndex(1)
                .explanation("George Washington was the first President of the United States, serving from 1789 to 1797.")
                .topic("History")
                .difficulty("easy")
                .ageGroup("children")
                .build());
        
        // Teen History Questions
        questions.add(Question.builder()
                .id("hist_002")
                .questionText("In which year did World War II end?")
                .options(Arrays.asList("1944", "1945", "1946", "1947"))
                .correctAnswerIndex(1)
                .explanation("World War II ended in 1945 with the surrender of Japan on September 2, 1945.")
                .topic("History")
                .difficulty("medium")
                .ageGroup("teen")
                .build());
        
        // Adult History Questions
        questions.add(Question.builder()
                .id("hist_003")
                .questionText("What was the name of the economic policy that led to the Great Depression?")
                .options(Arrays.asList("Laissez-faire", "Keynesianism", "Mercantilism", "Socialism"))
                .correctAnswerIndex(0)
                .explanation("Laissez-faire economic policies, which advocated minimal government intervention, contributed to the conditions that led to the Great Depression.")
                .topic("History")
                .difficulty("hard")
                .ageGroup("adult")
                .build());
        
        return questions;
    }

    /**
     * Get geography-related questions
     * @return List of geography questions
     */
    private List<Question> getGeographyQuestions() {
        List<Question> questions = new ArrayList<>();
        
        // Children Geography Questions
        questions.add(Question.builder()
                .id("geo_001")
                .questionText("What is the largest ocean on Earth?")
                .options(Arrays.asList("Atlantic", "Pacific", "Indian", "Arctic"))
                .correctAnswerIndex(1)
                .explanation("The Pacific Ocean is the largest ocean on Earth, covering more than 30% of the Earth's surface.")
                .topic("Geography")
                .difficulty("easy")
                .ageGroup("children")
                .build());
        
        // Teen Geography Questions
        questions.add(Question.builder()
                .id("geo_002")
                .questionText("Which country has the most natural lakes?")
                .options(Arrays.asList("Russia", "Canada", "United States", "Finland"))
                .correctAnswerIndex(1)
                .explanation("Canada has the most natural lakes in the world, with over 2 million lakes.")
                .topic("Geography")
                .difficulty("medium")
                .ageGroup("teen")
                .build());
        
        // Adult Geography Questions
        questions.add(Question.builder()
                .id("geo_003")
                .questionText("What is the name of the deepest point in the world's oceans?")
                .options(Arrays.asList("Mariana Trench", "Puerto Rico Trench", "Java Trench", "Tonga Trench"))
                .correctAnswerIndex(0)
                .explanation("The Mariana Trench in the western Pacific Ocean is the deepest point on Earth, reaching depths of over 36,000 feet.")
                .topic("Geography")
                .difficulty("hard")
                .ageGroup("adult")
                .build());
        
        return questions;
    }

    /**
     * Get general knowledge questions
     * @return List of general knowledge questions
     */
    private List<Question> getGeneralKnowledgeQuestions() {
        List<Question> questions = new ArrayList<>();
        
        // Children General Knowledge Questions
        questions.add(Question.builder()
                .id("gk_001")
                .questionText("How many days are in a week?")
                .options(Arrays.asList("5", "6", "7", "8"))
                .correctAnswerIndex(2)
                .explanation("There are 7 days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday.")
                .topic("General Knowledge")
                .difficulty("easy")
                .ageGroup("children")
                .build());
        
        // Teen General Knowledge Questions
        questions.add(Question.builder()
                .id("gk_002")
                .questionText("What is the capital of Australia?")
                .options(Arrays.asList("Sydney", "Melbourne", "Canberra", "Perth"))
                .correctAnswerIndex(2)
                .explanation("Canberra is the capital of Australia, not Sydney or Melbourne which are larger cities.")
                .topic("General Knowledge")
                .difficulty("medium")
                .ageGroup("teen")
                .build());
        
        // Adult General Knowledge Questions
        questions.add(Question.builder()
                .id("gk_003")
                .questionText("Who wrote '1984'?")
                .options(Arrays.asList("Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"))
                .correctAnswerIndex(1)
                .explanation("George Orwell wrote '1984', a dystopian novel published in 1949.")
                .topic("General Knowledge")
                .difficulty("hard")
                .ageGroup("adult")
                .build());
        
        return questions;
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
                .id(quiz.getId())
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
                .id(question.getId())
                .questionText(question.getQuestionText())
                .options(question.getOptions())
                .correctAnswerIndex(question.getCorrectAnswerIndex())
                .explanation(question.getExplanation())
                .difficulty(question.getDifficulty())
                .ageGroup(question.getAgeGroup())
                .build();
    }

    /**
     * Capitalize the first letter of a string
     * @param str The string to capitalize
     * @return Capitalized string
     */
    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}
