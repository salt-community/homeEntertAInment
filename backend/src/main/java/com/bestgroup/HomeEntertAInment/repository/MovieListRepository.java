package com.bestgroup.HomeEntertAInment.repository;

import com.bestgroup.HomeEntertAInment.entity.MovieList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieListRepository extends JpaRepository<MovieList, Long> {
    List<MovieList> findByClerkUserIdOrderByCreatedAtDesc(String clerkUserId);
    
    @Query("SELECT ml FROM MovieList ml LEFT JOIN FETCH ml.movies WHERE ml.id = :listId AND ml.clerkUserId = :clerkUserId")
    Optional<MovieList> findByIdAndClerkUserIdWithMovies(@Param("listId") Long listId, @Param("clerkUserId") String clerkUserId);
    
    @Query("SELECT ml FROM MovieList ml LEFT JOIN FETCH ml.movies WHERE ml.clerkUserId = :clerkUserId ORDER BY ml.createdAt DESC")
    List<MovieList> findByClerkUserIdWithMoviesOrderByCreatedAtDesc(@Param("clerkUserId") String clerkUserId);
}
