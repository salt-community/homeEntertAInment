package com.bestgroup.HomeEntertAInment.boardgame.repository;

import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Session entity operations
 * Provides data access methods for game session management
 */
@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    /**
     * Find a session by its unique session ID
     *
     * @param sessionId The unique session identifier
     * @return Optional containing the session if found
     */
    Optional<Session> findBySessionId(String sessionId);

    /**
     * Find all active sessions
     *
     * @return List of active sessions
     */
    List<Session> findByIsActiveTrue();



    /**
     * Find sessions created after a specific date
     *
     * @param date The date to filter from
     * @return List of sessions created after the specified date
     */
    List<Session> findByCreatedAtAfter(LocalDateTime date);



    /**
     * Find sessions by game state
     *
     * @param gameState The current game state
     * @return List of sessions in the specified game state
     */
    List<Session> findByGameState(String gameState);

    /**
     * Find active sessions by game state
     *
     * @param gameState The current game state
     * @return List of active sessions in the specified game state
     */
    List<Session> findByGameStateAndIsActiveTrue(String gameState);
}
