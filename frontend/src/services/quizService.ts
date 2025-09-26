// Import API configuration
// Uses VITE_API_BASE_URL environment variable with fallback to http://localhost:8080
import API_BASE_URL from "./api";

// Types for quiz configuration
export interface QuizConfiguration {
  ageGroup: string;
  topics: string[];
  difficulty: string;
  questionCount: number;
  userId: string;
  isPrivate: boolean;
}

// Question response type (matches QuestionResponseDto from backend)
export interface QuestionResponse {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: string;
  ageGroup: string;
}

// Quiz response type (matches QuizResponseDto from backend)
export interface QuizResponse {
  id: string;
  title: string;
  questions: QuestionResponse[];
  ageGroup: string;
  topics: string[];
  difficulty: string;
  description: string;
}

// API response types
export interface QuizCreationResponse {
  success: boolean;
  message: string;
  quizId?: string;
  quiz?: QuizResponse;
}

// Quiz submission response type
export interface QuizSubmissionResponse {
  success: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  results: QuestionResult[];
}

// Individual question result type
export interface QuestionResult {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

// Quiz list item type (for getAllQuizzes)
export interface QuizListItem {
  id: string;
  title: string;
  ageGroup: string;
  topics: string[];
  difficulty: string;
  questionCount: number;
  description: string;
  isPrivate: boolean;
}

// Quiz service for API calls
export class QuizService {
  private static readonly BASE_URL = `${API_BASE_URL}/api/quiz`;

  /**
   * Create a new quiz with the given configuration
   * @param config Quiz configuration data
   * @param token Clerk authentication token
   * @returns Promise with quiz creation response
   */
  static async createQuiz(
    config: QuizConfiguration,
    token: string
  ): Promise<QuizCreationResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const quiz: QuizResponse = await response.json();
      return {
        success: true,
        message: "Quiz created successfully",
        quizId: quiz.id,
        quiz: quiz,
      };
    } catch (error) {
      console.error("Error creating quiz:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Get a quiz by ID
   * @param quizId The ID of the quiz to retrieve
   * @returns Promise with quiz data
   */
  static async getQuiz(quizId: string): Promise<QuizResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/${quizId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching quiz:", error);
      throw error;
    }
  }

  /**
   * Get all available quizzes
   * @returns Promise with list of quizzes
   */
  static async getAllQuizzes(): Promise<QuizListItem[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/all`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching all quizzes:", error);
      throw error;
    }
  }

  /**
   * Get all quizzes created by a specific user
   * @param userId The ID of the user who created the quizzes
   * @param token Clerk authentication token
   * @returns Promise with list of quizzes created by the user
   */
  static async getUserQuizzes(
    userId: string,
    token: string
  ): Promise<QuizListItem[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user quizzes:", error);
      throw error;
    }
  }

  /**
   * Submit quiz answers
   * @param quizId The ID of the quiz
   * @param answers The answers to submit (array of answer indices)
   * @returns Promise with quiz results
   */
  static async submitQuiz(
    quizId: string,
    answers: number[]
  ): Promise<QuizSubmissionResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting quiz:", error);
      throw error;
    }
  }

  /**
   * Update the privacy setting of a quiz
   * @param quizId The ID of the quiz to update
   * @param userId The ID of the user making the request
   * @param isPrivate The new privacy setting
   * @param token The authentication token
   * @returns Promise that resolves when the update is complete
   */
  static async updateQuizPrivacy(
    quizId: string,
    userId: string,
    isPrivate: boolean,
    token: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${quizId}/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          isPrivate,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update quiz privacy: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating quiz privacy:", error);
      throw error;
    }
  }
}
