package com.bestgroup.HomeEntertAInment.boardgame.controller;

import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
     * Get a specific session by session ID
     * 
     * @param sessionId The unique session identifier
     * @return ResponseEntity containing the session if found
     */
    @GetMapping("/{sessionId}")
    public ResponseEntity<Session> getSessionById(@PathVariable String sessionId) {
        try {
            log.info("Received request to get session: {}", sessionId);
            Optional<Session> session = sessionService.getSessionById(sessionId);
            
            if (session.isPresent()) {
                log.info("Found session: {}", sessionId);
                return ResponseEntity.ok(session.get());
            } else {
                log.warn("Session not found: {}", sessionId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving session {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get sessions by game name
     * 
     * @param gameName The name of the board game
     * @return ResponseEntity containing list of sessions for the specified game
     */
    @GetMapping("/game/{gameName}")
    public ResponseEntity<List<Session>> getSessionsByGame(@PathVariable String gameName) {
        try {
            log.info("Received request to get sessions for game: {}", gameName);
            List<Session> sessions = sessionService.getSessionsByGame(gameName);
            log.info("Retrieved {} sessions for game: {}", sessions.size(), gameName);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Error retrieving sessions for game {}: {}", gameName, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get active sessions by game name
     * 
     * @param gameName The name of the board game
     * @return ResponseEntity containing list of active sessions for the specified game
     */
    @GetMapping("/game/{gameName}/active")
    public ResponseEntity<List<Session>> getActiveSessionsByGame(@PathVariable String gameName) {
        try {
            log.info("Received request to get active sessions for game: {}", gameName);
            List<Session> activeSessions = sessionService.getActiveSessionsByGame(gameName);
            log.info("Retrieved {} active sessions for game: {}", activeSessions.size(), gameName);
            return ResponseEntity.ok(activeSessions);
        } catch (Exception e) {
            log.error("Error retrieving active sessions for game {}: {}", gameName, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get sessions by user ID
     * 
     * @param userId The user identifier
     * @return ResponseEntity containing list of sessions for the specified user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Session>> getSessionsByUser(@PathVariable String userId) {
        try {
            log.info("Received request to get sessions for user: {}", userId);
            List<Session> sessions = sessionService.getSessionsByUser(userId);
            log.info("Retrieved {} sessions for user: {}", sessions.size(), userId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            log.error("Error retrieving sessions for user {}: {}", userId, e.getMessage(), e);
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
            log.info("Created session: {}", session.getSessionId());
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            log.error("Error creating session for game {}: {}", gameName, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Deactivate a session
     * 
     * @param sessionId The session ID to deactivate
     * @return ResponseEntity indicating success or failure
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deactivateSession(@PathVariable String sessionId) {
        try {
            log.info("Received request to deactivate session: {}", sessionId);
            boolean deactivated = sessionService.deactivateSession(sessionId);
            
            if (deactivated) {
                log.info("Successfully deactivated session: {}", sessionId);
                return ResponseEntity.ok().build();
            } else {
                log.warn("Session not found for deactivation: {}", sessionId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error deactivating session {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
