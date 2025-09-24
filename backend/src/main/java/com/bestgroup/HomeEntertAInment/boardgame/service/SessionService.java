package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
     * Retrieve all sessions for a specific user
     *
     * @param clerkUserId The Clerk user ID
     * @return List of sessions owned by the user
     */
    @Transactional(readOnly = true)
    public List<Session> getAllSessionsForUser(String clerkUserId) {
        log.info("Retrieving all sessions for user: {}", clerkUserId);
        return sessionRepository.findByClerkUserId(clerkUserId);
    }

    /**
     * Retrieve all sessions (deprecated - use getAllSessionsForUser instead)
     *
     * @return List of all sessions
     * @deprecated Use getAllSessionsForUser instead for user-specific data
     */
    @Deprecated
    @Transactional(readOnly = true)
    public List<Session> getAllSessions() {
        log.info("Retrieving all sessions");
        return sessionRepository.findAll();
    }

    /**
     * Retrieve all active sessions for a specific user
     *
     * @param clerkUserId The Clerk user ID
     * @return List of active sessions owned by the user
     */
    @Transactional(readOnly = true)
    public List<Session> getActiveSessionsForUser(String clerkUserId) {
        log.info("Retrieving all active sessions for user: {}", clerkUserId);
        return sessionRepository.findByClerkUserIdAndIsActiveTrue(clerkUserId);
    }

    /**
     * Retrieve all active sessions (deprecated - use getActiveSessionsForUser instead)
     *
     * @return List of active sessions
     * @deprecated Use getActiveSessionsForUser instead for user-specific data
     */
    @Deprecated
    @Transactional(readOnly = true)
    public List<Session> getActiveSessions() {
        log.info("Retrieving all active sessions");
        return sessionRepository.findByIsActiveTrue();
    }


    /**
     * Find a session by its numeric ID and user ID
     *
     * @param id The numeric session ID
     * @param clerkUserId The Clerk user ID
     * @return Optional containing the session if found and owned by user
     */
    @Transactional(readOnly = true)
    public Optional<Session> getSessionByNumericIdAndUser(Long id, String clerkUserId) {
        log.info("Retrieving session with numeric ID: {} for user: {}", id, clerkUserId);
        return sessionRepository.findByIdAndClerkUserId(id, clerkUserId);
    }

    /**
     * Find a session by its numeric ID (deprecated - use getSessionByNumericIdAndUser instead)
     *
     * @param id The numeric session ID
     * @return Optional containing the session if found
     * @deprecated Use getSessionByNumericIdAndUser instead for user-specific data
     */
    @Deprecated
    @Transactional(readOnly = true)
    public Optional<Session> getSessionByNumericId(Long id) {
        log.info("Retrieving session with numeric ID: {}", id);
        return sessionRepository.findById(id);
    }

    /**
     * Create a new game session for a specific user
     *
     * @param gameName The name of the board game
     * @param clerkUserId The Clerk user ID
     * @return The created session
     */
    public Session createSessionForUser(String gameName, String clerkUserId) {
        log.info("Creating new session for game: {} and user: {}", gameName, clerkUserId);
        
        Session session = Session.builder()
                .gameName(gameName)
                .gameState("setup")
                .isActive(true)
                .clerkUserId(clerkUserId)
                .build();
        
        Session savedSession = sessionRepository.save(session);
        log.info("Created session with ID: {} for user: {}", savedSession.getId(), clerkUserId);
        
        return savedSession;
    }

    /**
     * Create a new game session (deprecated - use createSessionForUser instead)
     *
     * @param gameName The name of the board game
     * @param userId Optional user identifier
     * @return The created session
     * @deprecated Use createSessionForUser instead for user-specific data
     */
    @Deprecated
    public Session createSession(String gameName, String userId) {
        log.info("Creating new session for game: {} and user: {}", gameName, userId);
        
        Session session = Session.builder()
                .gameName(gameName)
                .gameState("setup")
                .isActive(true)
                .build();
        
        Session savedSession = sessionRepository.save(session);
        log.info("Created session with ID: {}", savedSession.getId());
        
        return savedSession;
    }

    /**
     * Update session information for a specific user
     *
     * @param id The session ID to update
     * @param gameState The new game state
     * @param clerkUserId The Clerk user ID
     * @return The updated session
     */
    public Optional<Session> updateSessionForUser(Long id, String gameState, String clerkUserId) {
        log.info("Updating session: {} for user: {}", id, clerkUserId);
        
        Optional<Session> sessionOpt = sessionRepository.findByIdAndClerkUserId(id, clerkUserId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setGameState(gameState);
            Session updatedSession = sessionRepository.save(session);
            log.info("Updated session: {} for user: {}", id, clerkUserId);
            return Optional.of(updatedSession);
        }
        
        log.warn("Session not found for update: {} for user: {}", id, clerkUserId);
        return Optional.empty();
    }

    /**
     * Update session information (deprecated - use updateSessionForUser instead)
     *
     * @param id The session ID to update
     * @param gameState The new game state
     * @return The updated session
     * @deprecated Use updateSessionForUser instead for user-specific data
     */
    @Deprecated
    public Optional<Session> updateSession(Long id, String gameState) {
        log.info("Updating session: {}", id);
        
        Optional<Session> sessionOpt = sessionRepository.findById(id);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setGameState(gameState);
            Session updatedSession = sessionRepository.save(session);
            log.info("Updated session: {}", id);
            return Optional.of(updatedSession);
        }
        
        log.warn("Session not found for update: {}", id);
        return Optional.empty();
    }


    /**
     * Deactivate a session for a specific user
     *
     * @param id The session ID to deactivate
     * @param clerkUserId The Clerk user ID
     * @return True if session was deactivated, false if not found
     */
    public boolean deactivateSessionForUser(Long id, String clerkUserId) {
        log.info("Deactivating session: {} for user: {}", id, clerkUserId);
        
        Optional<Session> sessionOpt = sessionRepository.findByIdAndClerkUserId(id, clerkUserId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setIsActive(false);
            sessionRepository.save(session);
            log.info("Deactivated session: {} for user: {}", id, clerkUserId);
            return true;
        }
        
        log.warn("Session not found for deactivation: {} for user: {}", id, clerkUserId);
        return false;
    }

    /**
     * Deactivate a session (deprecated - use deactivateSessionForUser instead)
     *
     * @param id The session ID to deactivate
     * @return True if session was deactivated, false if not found
     * @deprecated Use deactivateSessionForUser instead for user-specific data
     */
    @Deprecated
    public boolean deactivateSession(Long id) {
        log.info("Deactivating session: {}", id);
        
        Optional<Session> sessionOpt = sessionRepository.findById(id);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setIsActive(false);
            sessionRepository.save(session);
            log.info("Deactivated session: {}", id);
            return true;
        }
        
        log.warn("Session not found for deactivation: {}", id);
        return false;
    }




    /**
     * Save a session (for updates)
     *
     * @param session The session to save
     * @return The saved session
     */
    public Session saveSession(Session session) {
        log.info("Saving session: {}", session.getId());
        return sessionRepository.save(session);
    }
}
