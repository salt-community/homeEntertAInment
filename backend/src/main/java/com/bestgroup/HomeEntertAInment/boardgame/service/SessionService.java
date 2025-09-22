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
     * Find a session by its numeric ID
     *
     * @param id The numeric session ID
     * @return Optional containing the session if found
     */
    @Transactional(readOnly = true)
    public Optional<Session> getSessionByNumericId(Long id) {
        log.info("Retrieving session with numeric ID: {}", id);
        return sessionRepository.findById(id);
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
     * Update session information
     *
     * @param id The session ID to update
     * @param gameState The new game state
     * @return The updated session
     */
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
     * Deactivate a session
     *
     * @param id The session ID to deactivate
     * @return True if session was deactivated, false if not found
     */
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
