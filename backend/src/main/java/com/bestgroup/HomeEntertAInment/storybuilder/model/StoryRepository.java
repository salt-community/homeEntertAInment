package com.bestgroup.HomeEntertAInment.storybuilder.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StoryRepository extends JpaRepository<Story, UUID> {
    
    /**
     * Find all stories for a specific user
     */
    List<Story> findByUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * Find a specific story by ID and user ID (for security)
     */
    Optional<Story> findByIdAndUserId(UUID id, String userId);
    
    /**
     * Delete a story by ID and user ID (for security)
     */
    @Modifying
    @Transactional
    void deleteByIdAndUserId(UUID id, String userId);
    
    /**
     * Check if a story exists for a specific user
     */
    boolean existsByIdAndUserId(UUID id, String userId);
}
