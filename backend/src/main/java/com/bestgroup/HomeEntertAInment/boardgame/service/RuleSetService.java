package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.dto.DecodedConvertApiResponse;
import com.bestgroup.HomeEntertAInment.boardgame.entity.RuleSet;
import com.bestgroup.HomeEntertAInment.boardgame.repository.RuleSetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing rule sets
 * Handles CRUD operations and business logic for rule sets
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RuleSetService {

    private final RuleSetRepository ruleSetRepository;

    /**
     * Get all rule sets for a specific user
     * 
     * @param clerkUserId The Clerk user ID
     * @return List of rule sets owned by the user
     */
    @Transactional(readOnly = true)
    public List<RuleSet> getAllRuleSetsForUser(String clerkUserId) {
        log.info("Retrieving all rule sets for user: {}", clerkUserId);
        return ruleSetRepository.findByClerkUserIdOrderByCreatedAtDesc(clerkUserId);
    }

    /**
     * Get all rule sets (deprecated - use getAllRuleSetsForUser instead)
     * 
     * @return List of all rule sets
     * @deprecated Use getAllRuleSetsForUser instead for user-specific data
     */
    @Deprecated
    @Transactional(readOnly = true)
    public List<RuleSet> getAllRuleSets() {
        log.info("Retrieving all rule sets");
        return ruleSetRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Get rule set by ID and user
     * 
     * @param id the rule set ID
     * @param clerkUserId The Clerk user ID
     * @return Optional containing the rule set if found and owned by user
     */
    @Transactional(readOnly = true)
    public Optional<RuleSet> getRuleSetByIdAndUser(Long id, String clerkUserId) {
        log.info("Retrieving rule set with ID: {} for user: {}", id, clerkUserId);
        return ruleSetRepository.findByIdAndClerkUserId(id, clerkUserId);
    }

    /**
     * Get rule set by ID (deprecated - use getRuleSetByIdAndUser instead)
     * 
     * @param id the rule set ID
     * @return Optional containing the rule set if found
     * @deprecated Use getRuleSetByIdAndUser instead for user-specific data
     */
    @Deprecated
    @Transactional(readOnly = true)
    public Optional<RuleSet> getRuleSetById(Long id) {
        log.info("Retrieving rule set with ID: {}", id);
        return ruleSetRepository.findById(id);
    }

    /**
     * Get rule set by file name
     * 
     * @param fileName the file name
     * @return Optional containing the rule set if found
     */
    @Transactional(readOnly = true)
    public Optional<RuleSet> getRuleSetByFileName(String fileName) {
        log.info("Retrieving rule set with file name: {}", fileName);
        return ruleSetRepository.findByFileName(fileName);
    }

    /**
     * Create a new rule set from DecodedConvertApiResponse for a specific user
     * 
     * @param response the decoded API response
     * @param clerkUserId The Clerk user ID
     * @return the created rule set
     */
    public RuleSet createRuleSetForUser(DecodedConvertApiResponse response, String clerkUserId) {
        if (response == null) {
            throw new IllegalArgumentException("DecodedConvertApiResponse cannot be null");
        }

        log.info("Creating rule set for file: {} and user: {}", response.getFileName(), clerkUserId);
        
        // Check if rule set already exists for this user
        if (ruleSetRepository.existsByFileNameAndClerkUserId(response.getFileName(), clerkUserId)) {
            log.warn("Rule set with file name {} already exists for user: {}", response.getFileName(), clerkUserId);
            throw new IllegalArgumentException("Rule set with file name " + response.getFileName() + " already exists for this user");
        }

        RuleSet ruleSet = RuleSet.fromDecodedConvertApiResponse(response);
        ruleSet.setClerkUserId(clerkUserId);
        RuleSet savedRuleSet = ruleSetRepository.save(ruleSet);
        
        log.info("Created rule set with ID: {} for user: {}", savedRuleSet.getId(), clerkUserId);
        return savedRuleSet;
    }

    /**
     * Create a new rule set from DecodedConvertApiResponse (deprecated - use createRuleSetForUser instead)
     * 
     * @param response the decoded API response
     * @return the created rule set
     * @deprecated Use createRuleSetForUser instead for user-specific data
     */
    @Deprecated
    public RuleSet createRuleSet(DecodedConvertApiResponse response) {
        if (response == null) {
            throw new IllegalArgumentException("DecodedConvertApiResponse cannot be null");
        }

        log.info("Creating rule set for file: {}", response.getFileName());
        
        // Check if rule set already exists
        if (ruleSetRepository.existsByFileName(response.getFileName())) {
            log.warn("Rule set with file name {} already exists", response.getFileName());
            throw new IllegalArgumentException("Rule set with file name " + response.getFileName() + " already exists");
        }

        RuleSet ruleSet = RuleSet.fromDecodedConvertApiResponse(response);
        RuleSet savedRuleSet = ruleSetRepository.save(ruleSet);
        
        log.info("Created rule set with ID: {}", savedRuleSet.getId());
        return savedRuleSet;
    }

    /**
     * Update an existing rule set
     * 
     * @param id the rule set ID
     * @param response the updated decoded API response
     * @return the updated rule set
     */
    public RuleSet updateRuleSet(Long id, DecodedConvertApiResponse response) {
        if (response == null) {
            throw new IllegalArgumentException("DecodedConvertApiResponse cannot be null");
        }

        log.info("Updating rule set with ID: {}", id);
        
        RuleSet existingRuleSet = ruleSetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rule set with ID " + id + " not found"));

        // Update fields
        existingRuleSet.setFileName(response.getFileName());
        existingRuleSet.setFileExt(response.getFileExt());
        existingRuleSet.setFileSize(response.getFileSize());
        existingRuleSet.setCodedData(response.getCodedData());
        existingRuleSet.setDecodedData(response.getDecodedData());

        RuleSet updatedRuleSet = ruleSetRepository.save(existingRuleSet);
        log.info("Updated rule set with ID: {}", updatedRuleSet.getId());
        
        return updatedRuleSet;
    }

    /**
     * Delete a rule set by ID
     * 
     * @param id the rule set ID
     * @return true if deleted, false if not found
     */
    public boolean deleteRuleSet(Long id) {
        log.info("Deleting rule set with ID: {}", id);
        
        if (!ruleSetRepository.existsById(id)) {
            log.warn("Rule set with ID {} not found", id);
            return false;
        }

        ruleSetRepository.deleteById(id);
        log.info("Deleted rule set with ID: {}", id);
        return true;
    }

    /**
     * Create a new rule set from text input for a specific user
     * 
     * @param gameName the name of the game
     * @param ruleText the text content of the rules
     * @param clerkUserId The Clerk user ID
     * @return the created rule set
     */
    public RuleSet createRuleSetFromTextForUser(String gameName, String ruleText, String clerkUserId) {
        if (gameName == null || gameName.trim().isEmpty()) {
            throw new IllegalArgumentException("Game name cannot be null or empty");
        }
        if (ruleText == null || ruleText.trim().isEmpty()) {
            throw new IllegalArgumentException("Rule text cannot be null or empty");
        }

        log.info("Creating rule set from text for game: {} and user: {}", gameName, clerkUserId);
        
        // Generate a unique file name based on game name and timestamp
        String fileName = gameName.replaceAll("[^a-zA-Z0-9]", "_") + "_rules_" + System.currentTimeMillis() + ".txt";
        
        // Check if rule set already exists with this file name for this user
        if (ruleSetRepository.existsByFileNameAndClerkUserId(fileName, clerkUserId)) {
            log.warn("Rule set with file name {} already exists for user: {}", fileName, clerkUserId);
            throw new IllegalArgumentException("Rule set with file name " + fileName + " already exists for this user");
        }

        RuleSet ruleSet = RuleSet.builder()
                .fileName(fileName)
                .fileExt("txt")
                .fileSize(ruleText.length())
                .codedData(null) // No coded data for text input
                .decodedData(ruleText.trim())
                .clerkUserId(clerkUserId)
                .build();
        
        RuleSet savedRuleSet = ruleSetRepository.save(ruleSet);
        
        log.info("Created rule set from text with ID: {} for user: {}", savedRuleSet.getId(), clerkUserId);
        return savedRuleSet;
    }

    /**
     * Create a new rule set from text input (deprecated - use createRuleSetFromTextForUser instead)
     * 
     * @param gameName the name of the game
     * @param ruleText the text content of the rules
     * @return the created rule set
     * @deprecated Use createRuleSetFromTextForUser instead for user-specific data
     */
    @Deprecated
    public RuleSet createRuleSetFromText(String gameName, String ruleText) {
        if (gameName == null || gameName.trim().isEmpty()) {
            throw new IllegalArgumentException("Game name cannot be null or empty");
        }
        if (ruleText == null || ruleText.trim().isEmpty()) {
            throw new IllegalArgumentException("Rule text cannot be null or empty");
        }

        log.info("Creating rule set from text for game: {}", gameName);
        
        // Generate a unique file name based on game name and timestamp
        String fileName = gameName.replaceAll("[^a-zA-Z0-9]", "_") + "_rules_" + System.currentTimeMillis() + ".txt";
        
        // Check if rule set already exists with this file name
        if (ruleSetRepository.existsByFileName(fileName)) {
            log.warn("Rule set with file name {} already exists", fileName);
            throw new IllegalArgumentException("Rule set with file name " + fileName + " already exists");
        }

        RuleSet ruleSet = RuleSet.builder()
                .fileName(fileName)
                .fileExt("txt")
                .fileSize(ruleText.length())
                .codedData(null) // No coded data for text input
                .decodedData(ruleText.trim())
                .build();
        
        RuleSet savedRuleSet = ruleSetRepository.save(ruleSet);
        
        log.info("Created rule set from text with ID: {}", savedRuleSet.getId());
        return savedRuleSet;
    }
}
