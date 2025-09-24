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
import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    private final ClerkUserExtractor clerkUserExtractor;

    /**
     * Get all sessions for the authenticated user
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity containing list of user's sessions
     */
    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions(Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Received request to get all sessions for user: {}", clerkUserId);
            List<Session> sessions = sessionService.getAllSessionsForUser(clerkUserId);
            log.info("Retrieved {} sessions for user: {}", sessions.size(), clerkUserId);
            return ResponseEntity.ok(sessions);
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.unauthorized().build();
        } catch (Exception e) {
            log.error("Error retrieving sessions: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all active sessions for the authenticated user
     * 
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity containing list of user's active sessions
     */
    @GetMapping("/active")
    public ResponseEntity<List<Session>> getActiveSessions(Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Received request to get active sessions for user: {}", clerkUserId);
            List<Session> activeSessions = sessionService.getActiveSessionsForUser(clerkUserId);
            log.info("Retrieved {} active sessions for user: {}", activeSessions.size(), clerkUserId);
            return ResponseEntity.ok(activeSessions);
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.unauthorized().build();
        } catch (Exception e) {
            log.error("Error retrieving active sessions: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create a new session for the authenticated user
     * 
     * @param gameName The name of the board game
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity containing the created session
     */
    @PostMapping
    public ResponseEntity<Session> createSession(@RequestParam String gameName, 
                                               Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Received request to create session for game: {} and user: {}", gameName, clerkUserId);
            Session session = sessionService.createSessionForUser(gameName, clerkUserId);
            log.info("Created session: {} for user: {}", session.getId(), clerkUserId);
            return ResponseEntity.ok(session);
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.unauthorized().build();
        } catch (Exception e) {
            log.error("Error creating session for game {}: {}", gameName, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create a new session with PDF rule file and players for the authenticated user
     * 
     * @param gameName The name of the board game
     * @param playerNames Comma-separated list of player names
     * @param ruleFile The PDF file containing game rules (optional)
     * @param ruleText The text content containing game rules (optional)
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity containing the created session with rule set
     */
    @PostMapping("/create-with-rules")
    public ResponseEntity<Session> createSessionWithRules(@RequestParam String gameName,
                                                        @RequestParam String playerNames,
                                                        @RequestParam(value = "ruleFile", required = false) MultipartFile ruleFile,
                                                        @RequestParam(value = "ruleText", required = false) String ruleText,
                                                        Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Received request to create session with rules for game: {} with players: {} for user: {}", gameName, playerNames, clerkUserId);
            
            // Validate that either ruleFile or ruleText is provided, but not both
            boolean hasRuleFile = ruleFile != null && !ruleFile.isEmpty();
            boolean hasRuleText = ruleText != null && !ruleText.trim().isEmpty();
            
            if (!hasRuleFile && !hasRuleText) {
                log.warn("Neither rule file nor rule text provided");
                return ResponseEntity.badRequest().build();
            }
            
            if (hasRuleFile && hasRuleText) {
                log.warn("Both rule file and rule text provided - only one should be provided");
                return ResponseEntity.badRequest().build();
            }
            
            RuleSet ruleSet;
            
            if (hasRuleFile) {
                // Handle PDF file processing (existing flow)
                log.info("Processing PDF rule file: {} for user: {}", ruleFile.getOriginalFilename(), clerkUserId);
                ConvertApiResponseDto convertResult = convertApiService.convertPdfToText(ruleFile);
                DecodedConvertApiResponse decodedResponse = transformToDecodedResponse(convertResult);
                ruleSet = ruleSetService.createRuleSetForUser(decodedResponse, clerkUserId);
            } else {
                // Handle text input (new flow)
                log.info("Processing text rule input for user: {}", clerkUserId);
                ruleSet = ruleSetService.createRuleSetFromTextForUser(gameName, ruleText.trim(), clerkUserId);
            }
            
            log.info("Created rule set: {} for user: {}", ruleSet.getId(), clerkUserId);
            
            // Create Session
            Session session = sessionService.createSessionForUser(gameName, clerkUserId);
            
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
            
            log.info("Created session with rules: {} with {} players for user: {}", savedSession.getId(), players.size(), clerkUserId);
            return ResponseEntity.ok(savedSession);
            
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.unauthorized().build();
        } catch (IllegalArgumentException e) {
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
     * Get a specific session by ID for the authenticated user
     * 
     * @param id The session ID
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity containing the session if found and owned by user
     */
    @GetMapping("/{id}")
    public ResponseEntity<Session> getSessionById(@PathVariable Long id, Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Received request to get session: {} for user: {}", id, clerkUserId);
            Optional<Session> session = sessionService.getSessionByNumericIdAndUser(id, clerkUserId);
            
            if (session.isPresent()) {
                log.info("Found session: {} for user: {}", id, clerkUserId);
                return ResponseEntity.ok(session.get());
            } else {
                log.warn("Session not found: {} for user: {}", id, clerkUserId);
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.unauthorized().build();
        } catch (Exception e) {
            log.error("Error retrieving session {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Deactivate a session for the authenticated user
     * 
     * @param id The session ID to deactivate
     * @param authentication The Spring Security authentication object
     * @return ResponseEntity indicating success or failure
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateSession(@PathVariable Long id, Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Received request to deactivate session: {} for user: {}", id, clerkUserId);
            boolean deactivated = sessionService.deactivateSessionForUser(id, clerkUserId);
            
            if (deactivated) {
                log.info("Successfully deactivated session: {} for user: {}", id, clerkUserId);
                return ResponseEntity.ok().build();
            } else {
                log.warn("Session not found for deactivation: {} for user: {}", id, clerkUserId);
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.unauthorized().build();
        } catch (Exception e) {
            log.error("Error deactivating session {}: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
