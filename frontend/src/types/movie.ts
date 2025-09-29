export interface MovieRequest {
  genres?: string[];
  ageRating?: string;
  duration?: number;
  decade?: string;
  mood?: string;
  customDescription?: string;
}

export interface Movie {
  title: string;
  year: number;
  genres: string[];
  description: string;
  duration: number;
  ageRating: string;
  director: string;
  cast: string[];
  rating: number;
  posterUrl?: string;
  recommendationReason: string;
}

export interface MovieResponse {
  movies: Movie[];
}
