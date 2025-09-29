import type { MovieRequest, MovieResponse, MovieListSummary, MovieListDetail } from "../types/movie";

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

  /**
   * Save a movie list
   */
  static async saveMovieList(
    listName: string,
    description: string,
    searchCriteria: string,
    movies: MovieResponse,
    token?: string
  ): Promise<{ success: boolean; message: string; listId?: number }> {
    const response = await fetch(`${BASE_URL}/api/movie-lists/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        listName,
        description,
        searchCriteria,
        movies,
      }),
    });

    if (!response.ok) {
      const message = await safeReadText(response);
      throw new Error(
        message || `Request failed with status ${response.status}`
      );
    }

    return (await response.json()) as {
      success: boolean;
      message: string;
      listId?: number;
    };
  }

  /**
   * Get user's saved movie lists
   */
  static async getUserMovieLists(
    token?: string
  ): Promise<MovieListSummary[]> {
    const response = await fetch(`${BASE_URL}/api/movie-lists`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const message = await safeReadText(response);
      throw new Error(
        message || `Request failed with status ${response.status}`
      );
    }

    const lists = (await response.json()) as any[];
    return lists.map(list => ({
      id: list.id,
      listName: list.listName,
      description: list.description,
      movieCount: list.movieCount || 0,
      createdAt: list.createdAt,
    }));
  }

  /**
   * Get a specific movie list
   */
  static async getMovieList(
    listId: number,
    token?: string
  ): Promise<MovieListDetail> {
    const response = await fetch(`${BASE_URL}/api/movie-lists/${listId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const message = await safeReadText(response);
      throw new Error(
        message || `Request failed with status ${response.status}`
      );
    }

    const list = (await response.json()) as any;
    return {
      id: list.id,
      listName: list.listName,
      description: list.description,
      searchCriteria: list.searchCriteria,
      createdAt: list.createdAt,
      movies: list.movies?.map((movie: any) => ({
        title: movie.title,
        year: movie.year,
        imdbId: movie.imdbId,
        genres: Array.isArray(movie.genres) ? movie.genres : (movie.genres ? JSON.parse(movie.genres) : []),
        description: movie.description,
        duration: movie.duration,
        ageRating: movie.ageRating,
        director: movie.director,
        cast: Array.isArray(movie.cast) ? movie.cast : (movie.cast ? JSON.parse(movie.cast) : []),
        rating: movie.rating,
        recommendationReason: movie.recommendationReason,
      })) || [],
    };
  }

  /**
   * Delete a movie list
   */
  static async deleteMovieList(
    listId: number,
    token?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${BASE_URL}/api/movie-lists/${listId}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const message = await safeReadText(response);
      throw new Error(
        message || `Request failed with status ${response.status}`
      );
    }

    return (await response.json()) as { success: boolean; message: string };
  }
}

async function safeReadText(response: Response): Promise<string | undefined> {
  try {
    return await response.text();
  } catch {
    return undefined;
  }
}
