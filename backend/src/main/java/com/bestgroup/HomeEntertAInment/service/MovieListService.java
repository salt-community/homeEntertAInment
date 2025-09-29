package com.bestgroup.HomeEntertAInment.service;

import com.bestgroup.HomeEntertAInment.dto.MovieResponseDto;
import com.bestgroup.HomeEntertAInment.entity.MovieList;
import com.bestgroup.HomeEntertAInment.entity.MovieListItem;
import com.bestgroup.HomeEntertAInment.repository.MovieListRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieListService {

    private final MovieListRepository movieListRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public MovieList saveMovieList(String clerkUserId, String listName, String description, String searchCriteria, MovieResponseDto movieResponse) throws JsonProcessingException {
        MovieList movieList = MovieList.builder()
                .clerkUserId(clerkUserId)
                .listName(listName)
                .description(description)
                .searchCriteria(searchCriteria)
                .build();

        movieList = movieListRepository.save(movieList);

        if (movieResponse.getMovies() != null) {
            final MovieList finalMovieList = movieList;
            List<MovieListItem> movieItems = movieResponse.getMovies().stream()
                    .map(movie -> createMovieListItem(finalMovieList, movie))
                    .collect(Collectors.toList());

            movieList.setMovies(movieItems);
            movieList = movieListRepository.save(movieList);
        }
        
        log.info("Saved movie list '{}' with {} movies for user {}", listName, movieResponse.getMovies() != null ? movieResponse.getMovies().size() : 0, clerkUserId);
        return movieList;
    }

    private MovieListItem createMovieListItem(MovieList movieList, MovieResponseDto.MovieDto movie) {
        try {
            return MovieListItem.builder()
                    .movieList(movieList)
                    .title(movie.getTitle())
                    .year(movie.getYear())
                    .imdbId(movie.getImdbId())
                    .rating(movie.getRating())
                    .ageRating(movie.getAgeRating())
                    .duration(movie.getDuration())
                    .director(movie.getDirector())
                    .genres(movie.getGenres() != null ? objectMapper.writeValueAsString(movie.getGenres()) : null)
                    .cast(movie.getCast() != null ? objectMapper.writeValueAsString(movie.getCast()) : null)
                    .description(movie.getDescription())
                    .recommendationReason(movie.getRecommendationReason())
                    .build();
        } catch (JsonProcessingException e) {
            log.error("Error serializing genres/cast for movie {}: {}", movie.getTitle(), e.getMessage());
            throw new RuntimeException("Failed to serialize movie data", e);
        }
    }

    public List<MovieList> getMovieListsByUserId(String clerkUserId) {
        return movieListRepository.findByClerkUserIdOrderByCreatedAtDesc(clerkUserId);
    }

    public Optional<MovieList> getMovieListByIdAndUserId(Long listId, String clerkUserId) {
        return movieListRepository.findByIdAndClerkUserIdWithMovies(listId, clerkUserId);
    }

    @Transactional
    public void deleteMovieList(Long listId, String clerkUserId) {
        Optional<MovieList> movieList = getMovieListByIdAndUserId(listId, clerkUserId);
        if (movieList.isPresent()) {
            movieListRepository.delete(movieList.get());
            log.info("Deleted movie list {} for user {}", listId, clerkUserId);
        } else {
            throw new RuntimeException("Movie list not found or access denied");
        }
    }

    private MovieResponseDto.MovieDto convertToMovieDto(MovieListItem item) {
        try {
            return MovieResponseDto.MovieDto.builder()
                    .title(item.getTitle())
                    .year(item.getYear())
                    .imdbId(item.getImdbId())
                    .rating(item.getRating())
                    .ageRating(item.getAgeRating())
                    .duration(item.getDuration())
                    .director(item.getDirector())
                    .genres(item.getGenres() != null ? 
                            objectMapper.readValue(item.getGenres(), objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)) : null)
                    .cast(item.getCast() != null ? 
                            objectMapper.readValue(item.getCast(), objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)) : null)
                    .description(item.getDescription())
                    .recommendationReason(item.getRecommendationReason())
                    .build();
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON for movie item {}: {}", item.getTitle(), e.getMessage());
            return MovieResponseDto.MovieDto.builder()
                    .title(item.getTitle())
                    .description("Error loading details.")
                    .build();
        }
    }
}
