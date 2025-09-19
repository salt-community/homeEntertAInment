package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
                .userId(userId)
                .lastAccessedAt(LocalDateTime.now())
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
     * @param playerCount The number of players
     * @param currentTurn The current turn number
     * @param gameContext Additional game context
     * @return The updated session
     */
    public Optional<Session> updateSession(String sessionId, String gameState, 
                                         Integer playerCount, Integer currentTurn, 
                                         String gameContext) {
        log.info("Updating session: {}", sessionId);
        
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setGameState(gameState);
            session.setPlayerCount(playerCount);
            session.setCurrentTurn(currentTurn);
            session.setGameContext(gameContext);
            session.setLastAccessedAt(LocalDateTime.now());
            
            Session updatedSession = sessionRepository.save(session);
            log.info("Updated session: {}", sessionId);
            return Optional.of(updatedSession);
        }
        
        log.warn("Session not found for update: {}", sessionId);
        return Optional.empty();
    }

    /**
     * Update the last question and answer for a session
     *
     * @param sessionId The session ID
     * @param question The question asked
     * @param answer The answer provided
     * @return The updated session
     */
    public Optional<Session> updateQuestionAnswer(String sessionId, String question, String answer) {
        log.info("Updating Q&A for session: {}", sessionId);
        
        Optional<Session> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setLastQuestion(question);
            session.setLastAnswer(answer);
            session.setLastAccessedAt(LocalDateTime.now());
            
            Session updatedSession = sessionRepository.save(session);
            log.info("Updated Q&A for session: {}", sessionId);
            return Optional.of(updatedSession);
        }
        
        log.warn("Session not found for Q&A update: {}", sessionId);
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
            session.setLastAccessedAt(LocalDateTime.now());
            sessionRepository.save(session);
            log.info("Deactivated session: {}", sessionId);
            return true;
        }
        
        log.warn("Session not found for deactivation: {}", sessionId);
        return false;
    }


    /**
     * Get sessions by user ID
     *
     * @param userId The user identifier
     * @return List of sessions for the specified user
     */
    @Transactional(readOnly = true)
    public List<Session> getSessionsByUser(String userId) {
        log.info("Retrieving sessions for user: {}", userId);
        return sessionRepository.findByUserId(userId);
    }

    /**
     * Clean up old inactive sessions
     *
     * @param cutoffDate Sessions older than this date will be deactivated
     * @return Number of sessions deactivated
     */
    public int cleanupInactiveSessions(LocalDateTime cutoffDate) {
        log.info("Cleaning up sessions inactive since: {}", cutoffDate);
        
        List<Session> inactiveSessions = sessionRepository.findInactiveSessions(cutoffDate);
        int deactivatedCount = 0;
        
        for (Session session : inactiveSessions) {
            session.setIsActive(false);
            sessionRepository.save(session);
            deactivatedCount++;
        }
        
        log.info("Deactivated {} inactive sessions", deactivatedCount);
        return deactivatedCount;
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
