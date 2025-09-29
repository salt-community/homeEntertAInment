import type { MovieRequest, MovieResponse } from "../types/movie";

const BASE_URL = "http://localhost:8080";

export class MovieService {
  /**
   * Get movie recommendations based on user preferences
   */
  static async getRecommendations(
    request: MovieRequest,
    token?: string
  ): Promise<MovieResponse> {
    const response = await fetch(`${BASE_URL}/api/movies/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const message = await safeReadText(response);
      throw new Error(
        message || `Request failed with status ${response.status}`
      );
    }

    return (await response.json()) as MovieResponse;
  }
}

async function safeReadText(response: Response): Promise<string | undefined> {
  try {
    return await response.text();
  } catch {
    return undefined;
  }
}
