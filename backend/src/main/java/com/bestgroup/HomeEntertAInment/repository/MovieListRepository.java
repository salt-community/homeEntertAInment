package com.bestgroup.HomeEntertAInment.repository;

import com.bestgroup.HomeEntertAInment.entity.MovieList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieListRepository extends JpaRepository<MovieList, Long> {
    List<MovieList> findByClerkUserIdOrderByCreatedAtDesc(String clerkUserId);
}
