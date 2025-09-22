package com.bestgroup.HomeEntertAInment.boardgame.controller;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ConvertApiResponseDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.DecodedConvertApiResponse;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Player;
import com.bestgroup.HomeEntertAInment.boardgame.entity.RuleSet;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.service.ConvertApiService;
import com.bestgroup.HomeEntertAInment.boardgame.service.RuleSetService;
import com.bestgroup.HomeEntertAInment.boardgame.service.SessionService;
import com.bestgroup.HomeEntertAInment.boardgame.utils.DecodeBase64ToString;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Controller for managing game sessions in the Board Game Rule Inspector
 * Provides REST endpoints for session management operations
 */
@RestController
@RequestMapping("/api/boardgame/sessions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class SessionController {

    private final SessionService sessionService;
    private final RuleSetService ruleSetService;
    private final ConvertApiService convertApiService;

    /**
     * Get all sessions
     * 
     * @return ResponseEntity containing list of all sessions
     */
    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions() {
        try {
            log.info("Received request to get all sessions");
            List<Session> sessions = sessionService.getAllSessions();
            log.info("Retrieved {} sessions", sessions.size());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Error retrieving all sessions: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all active sessions
     * 
     * @return ResponseEntity containing list of active sessions
     */
    @GetMapping("/active")
    public ResponseEntity<List<Session>> getActiveSessions() {
        try {
            log.info("Received request to get active sessions");
            List<Session> activeSessions = sessionService.getActiveSessions();
            log.info("Retrieved {} active sessions", activeSessions.size());
            return ResponseEntity.ok(activeSessions);
        } catch (Exception e) {
            log.error("Error retrieving active sessions: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create a new session
     * 
     * @param gameName The name of the board game
     * @param userId Optional user identifier
     * @return ResponseEntity containing the created session
     */
    @PostMapping
    public ResponseEntity<Session> createSession(@RequestParam String gameName, 
                                               @RequestParam(required = false) String userId) {
        try {
            log.info("Received request to create session for game: {} and user: {}", gameName, userId);
            Session session = sessionService.createSession(gameName, userId);
            log.info("Created session: {}", session.getId());
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            log.error("Error creating session for game {}: {}", gameName, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create a new session with PDF rule file and players
     * 
     * @param gameName The name of the board game
     * @param playerNames Comma-separated list of player names
     * @param ruleFile The PDF file containing game rules
     * @return ResponseEntity containing the created session with rule set
     */
    @PostMapping("/create-with-rules")
    public ResponseEntity<Session> createSessionWithRules(@RequestParam String gameName,
                                                        @RequestParam String playerNames,
                                                        @RequestParam("ruleFile") MultipartFile ruleFile) {
        try {
            log.info("Received request to create session with rules for game: {} with players: {}", gameName, playerNames);
            
            if (ruleFile.isEmpty()) {
                log.warn("Rule file is empty");
                return ResponseEntity.badRequest().build();
            }

            // Convert PDF to text using ConvertApiService
            ConvertApiResponseDto convertResult = convertApiService.convertPdfToText(ruleFile);
            DecodedConvertApiResponse decodedResponse = transformToDecodedResponse(convertResult);
            
            // Create RuleSet from the decoded response
            RuleSet ruleSet = ruleSetService.createRuleSet(decodedResponse);
            log.info("Created rule set: {}", ruleSet.getId());
            
            // Create Session
            Session session = sessionService.createSession(gameName, null);
            
            // Set the rule set to the session
            session.setRuleSet(ruleSet);
            
            // Parse player names and create Player entities
            List<Player> players = new ArrayList<>();
            if (playerNames != null && !playerNames.trim().isEmpty()) {
                String[] names = playerNames.split(",");
                for (String name : names) {
                    if (!name.trim().isEmpty()) {
                        Player player = Player.builder()
                                .playerName(name.trim())
                                .session(session)
                                .build();
                        players.add(player);
                    }
                }
            }
            session.setPlayers(players);
            
            // Save the updated session with players and rule set
            Session savedSession = sessionService.saveSession(session);
            
            log.info("Created session with rules: {} with {} players", savedSession.getId(), players.size());
            return ResponseEntity.ok(savedSession);
            
        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Error processing rule file: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            log.error("Unexpected error creating session with rules: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Transforms ConvertApiResponseDto to DecodedConvertApiResponse
     * Extracts the first file from the response and decodes its content
     *
     * @param response The original ConvertAPI response
     * @return DecodedConvertApiResponse with decoded text content
     */
    private DecodedConvertApiResponse transformToDecodedResponse(ConvertApiResponseDto response) {
        if (response == null || response.getFiles() == null || response.getFiles().isEmpty()) {
            throw new IllegalStateException("No files found in the conversion response");
        }

        // Get the first converted file (assuming single file conversion)
        ConvertApiResponseDto.ConvertedFile file = response.getFiles().get(0);
        
        // Decode the Base64 file data to get the text content
        String decodedData = DecodeBase64ToString.decode(file.getFileData());
        
        return new DecodedConvertApiResponse(
            file.getFileName(),
            file.getFileExt(),
            file.getFileSize(),
            file.getFileData(), // codedData (original Base64)
            decodedData         // decodedData (decoded text)
        );
    }

    /**
     * Get a specific session by ID
     * 
     * @param id The session ID
     * @return ResponseEntity containing the session if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id) {
        try {
            log.info("Received request to get session: {}", id);
            Optional<Session> session = sessionService.getSessionByNumericId(id);
            
            if (session.isPresent()) {
                log.info("Found session: {}", id);
                return ResponseEntity.ok(session.get());
            } else {
                log.warn("Session not found: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving session {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Deactivate a session
     * 
     * @param id The session ID to deactivate
     * @return ResponseEntity indicating success or failure
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateSession(@PathVariable Long id) {
        try {
            log.info("Received request to deactivate session: {}", id);
            boolean deactivated = sessionService.deactivateSession(id);
            
            if (deactivated) {
                log.info("Successfully deactivated session: {}", id);
                return ResponseEntity.ok().build();
            } else {
                log.warn("Session not found for deactivation: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error deactivating session {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
