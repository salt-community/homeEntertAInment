// Types for quiz configuration
export interface QuizConfiguration {
  ageGroup: string;
  topics: string[];
  difficulty: string;
  questionCount: number;
}

// API response types
export interface QuizCreationResponse {
  success: boolean;
  message: string;
  quizId?: string;
}

// Quiz service for API calls
export class QuizService {
  private static readonly BASE_URL = 'http://localhost:8080/api/quiz';

  /**
   * Create a new quiz with the given configuration
   * @param config Quiz configuration data
   * @returns Promise with quiz creation response
   */
  static async createQuiz(config: QuizConfiguration): Promise<QuizCreationResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return {
        success: true,
        message: data,
      };
    } catch (error) {
      console.error('Error creating quiz:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get a quiz by ID
   * @param quizId The ID of the quiz to retrieve
   * @returns Promise with quiz data
   */
  static async getQuiz(quizId: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/${quizId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  /**
   * Get all available quizzes
   * @returns Promise with list of quizzes
   */
  static async getAllQuizzes(): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error fetching all quizzes:', error);
      throw error;
    }
  }

  /**
   * Submit quiz answers
   * @param quizId The ID of the quiz
   * @param answers The answers to submit
   * @returns Promise with quiz results
   */
  static async submitQuiz(quizId: string, answers: any): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }
}
