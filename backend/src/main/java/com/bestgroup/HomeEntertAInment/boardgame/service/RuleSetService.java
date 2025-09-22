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
     * Get all rule sets
     * 
     * @return List of all rule sets
     */
    @Transactional(readOnly = true)
    public List<RuleSet> getAllRuleSets() {
        log.info("Retrieving all rule sets");
        return ruleSetRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Get rule set by ID
     * 
     * @param id the rule set ID
     * @return Optional containing the rule set if found
     */
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
     * Create a new rule set from DecodedConvertApiResponse
     * 
     * @param response the decoded API response
     * @return the created rule set
     */
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
     * Get rule sets by file extension
     * 
     * @param fileExt the file extension
     * @return List of rule sets with the specified extension
     */
    @Transactional(readOnly = true)
    public List<RuleSet> getRuleSetsByFileExtension(String fileExt) {
        log.info("Retrieving rule sets with file extension: {}", fileExt);
        return ruleSetRepository.findByFileExt(fileExt);
    }
}
