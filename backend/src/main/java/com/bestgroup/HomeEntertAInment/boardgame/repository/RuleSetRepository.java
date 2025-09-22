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
}
