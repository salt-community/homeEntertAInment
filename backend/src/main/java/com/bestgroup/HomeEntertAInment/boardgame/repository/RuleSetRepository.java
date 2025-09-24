package com.bestgroup.HomeEntertAInment.boardgame.repository;

import com.bestgroup.HomeEntertAInment.boardgame.entity.RuleSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing RuleSet entities
 * Provides CRUD operations and custom queries for rule sets
 */
@Repository
public interface RuleSetRepository extends JpaRepository<RuleSet, Long> {

    /**
     * Find rule set by file name
     * 
     * @param fileName the name of the file
     * @return Optional containing the rule set if found
     */
    Optional<RuleSet> findByFileName(String fileName);

    /**
     * Find all rule sets by file extension
     * 
     * @param fileExt the file extension
     * @return List of rule sets with the specified extension
     */
    List<RuleSet> findByFileExt(String fileExt);

    /**
     * Check if a rule set exists by file name
     * 
     * @param fileName the name of the file
     * @return true if the rule set exists, false otherwise
     */
    boolean existsByFileName(String fileName);

    /**
     * Find all rule sets ordered by creation date (newest first)
     * 
     * @return List of rule sets ordered by creation date descending
     */
    List<RuleSet> findAllByOrderByCreatedAtDesc();

    /**
     * Find all rule sets for a specific Clerk user
     *
     * @param clerkUserId The Clerk user ID
     * @return List of rule sets owned by the user
     */
    List<RuleSet> findByClerkUserId(String clerkUserId);

    /**
     * Find all rule sets for a specific Clerk user ordered by creation date (newest first)
     *
     * @param clerkUserId The Clerk user ID
     * @return List of rule sets owned by the user ordered by creation date descending
     */
    List<RuleSet> findByClerkUserIdOrderByCreatedAtDesc(String clerkUserId);

    /**
     * Find a specific rule set by ID and Clerk user ID
     *
     * @param id The rule set ID
     * @param clerkUserId The Clerk user ID
     * @return Optional containing the rule set if found and owned by user
     */
    Optional<RuleSet> findByIdAndClerkUserId(Long id, String clerkUserId);

    /**
     * Find rule set by file name and Clerk user ID
     *
     * @param fileName The name of the file
     * @param clerkUserId The Clerk user ID
     * @return Optional containing the rule set if found and owned by user
     */
    Optional<RuleSet> findByFileNameAndClerkUserId(String fileName, String clerkUserId);

    /**
     * Check if a rule set exists by file name and Clerk user ID
     *
     * @param fileName The name of the file
     * @param clerkUserId The Clerk user ID
     * @return true if the rule set exists and is owned by user, false otherwise
     */
    boolean existsByFileNameAndClerkUserId(String fileName, String clerkUserId);
}
