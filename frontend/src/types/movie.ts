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
  imdbId?: string;
  genres: string[];
  description: string;
  duration: number;
  ageRating: string;
  director: string;
  cast: string[];
  rating: number;
  recommendationReason: string;
}

export interface MovieResponse {
  movies: Movie[];
}

export interface MovieListSummary {
  id: number;
  listName: string;
  description: string;
  movieCount: number;
  createdAt: string;
}

export interface MovieListDetail {
  id: number;
  listName: string;
  description: string;
  searchCriteria: string;
  createdAt: string;
  movies: Movie[];
}
