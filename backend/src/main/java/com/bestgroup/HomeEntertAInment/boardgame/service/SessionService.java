package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for managing game sessions
 * Provides business logic for session operations in the Board Game Rule Inspector
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SessionService {

    private final SessionRepository sessionRepository;

    /**
     * Retrieve all sessions
     *
     * @return List of all sessions
     */
    @Transactional(readOnly = true)
    public List<Session> getAllSessions() {
        log.info("Retrieving all sessions");
        return sessionRepository.findAll();
    }

    /**
     * Retrieve all active sessions
     *
     * @return List of active sessions
     */
    @Transactional(readOnly = true)
    public List<Session> getActiveSessions() {
        log.info("Retrieving all active sessions");
        return sessionRepository.findByIsActiveTrue();
    }

    /**
     * Find a session by its unique session ID
     *
     * @param sessionId The unique session identifier
     * @return Optional containing the session if found
     */
    @Transactional(readOnly = true)
    public Optional<Session> getSessionById(String sessionId) {
        log.info("Retrieving session with ID: {}", sessionId);
        return sessionRepository.findBySessionId(sessionId);
    }

    /**
     * Create a new game session
     *
     * @param gameName The name of the board game
     * @param userId Optional user identifier
     * @return The created session
     */
    public Session createSession(String gameName, String userId) {
        log.info("Creating new session for game: {} and user: {}", gameName, userId);
        
        String sessionId = generateSessionId();
        
        Session session = Session.builder()
                .sessionId(sessionId)
                .gameName(gameName)
                .gameState("setup")
                .isActive(true)
                .build();
        
        Session savedSession = sessionRepository.save(session);
        log.info("Created session with ID: {}", savedSession.getSessionId());
        
        return savedSession;
    }

    /**
     * Update session information
     *
     * @param sessionId The session ID to update
     * @param gameState The new game state
     * @return The updated session
     */
    public Optional<Session> updateSession(String sessionId, String gameState) {
        log.info("Updating session: {}", sessionId);
        
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setGameState(gameState);
            Session updatedSession = sessionRepository.save(session);
            log.info("Updated session: {}", sessionId);
            return Optional.of(updatedSession);
        }
        
        log.warn("Session not found for update: {}", sessionId);
        return Optional.empty();
    }


    /**
     * Deactivate a session
     *
     * @param sessionId The session ID to deactivate
     * @return True if session was deactivated, false if not found
     */
    public boolean deactivateSession(String sessionId) {
        log.info("Deactivating session: {}", sessionId);
        
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setIsActive(false);
            sessionRepository.save(session);
            log.info("Deactivated session: {}", sessionId);
            return true;
        }
        
        log.warn("Session not found for deactivation: {}", sessionId);
        return false;
    }




    /**
     * Generate a unique session ID
     *
     * @return A unique session identifier
     */
    private String generateSessionId() {
        return "session_" + UUID.randomUUID().toString().replace("-", "");
    }
}
