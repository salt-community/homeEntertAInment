package com.bestgroup.HomeEntertAInment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "movie_list_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_list_id", nullable = false)
    private MovieList movieList;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "year")
    private Integer year;

    @Column(name = "imdb_id")
    private String imdbId;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "age_rating")
    private String ageRating;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "director")
    private String director;

    @Column(name = "genres", columnDefinition = "TEXT")
    private String genres; // Stored as JSON string

    @Column(name = "movie_cast", columnDefinition = "TEXT")
    private String cast; // Stored as JSON string

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "recommendation_reason", columnDefinition = "TEXT")
    private String recommendationReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
