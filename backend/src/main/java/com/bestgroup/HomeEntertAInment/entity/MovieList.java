package com.bestgroup.HomeEntertAInment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "movie_lists")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "clerk_user_id", nullable = false)
    private String clerkUserId;

    @Column(name = "list_name", nullable = false)
    private String listName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "search_criteria", columnDefinition = "TEXT")
    private String searchCriteria;

    @OneToMany(mappedBy = "movieList", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MovieListItem> movies;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
