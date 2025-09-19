package com.bestgroup.HomeEntertAInment.boardgame.repository;

import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
     * Find all sessions for a specific game
     *
     * @param gameName The name of the board game
     * @return List of sessions for the specified game
     */
    List<Session> findByGameName(String gameName);

    /**
     * Find all active sessions for a specific game
     *
     * @param gameName The name of the board game
     * @return List of active sessions for the specified game
     */
    List<Session> findByGameNameAndIsActiveTrue(String gameName);

    /**
     * Find sessions by user ID
     *
     * @param userId The user identifier
     * @return List of sessions for the specified user
     */
    List<Session> findByUserId(String userId);

    /**
     * Find active sessions by user ID
     *
     * @param userId The user identifier
     * @return List of active sessions for the specified user
     */
    List<Session> findByUserIdAndIsActiveTrue(String userId);

    /**
     * Find sessions created after a specific date
     *
     * @param date The date to filter from
     * @return List of sessions created after the specified date
     */
    List<Session> findByCreatedAtAfter(LocalDateTime date);

    /**
     * Find sessions that haven't been accessed for a specified duration
     *
     * @param cutoffDate The cutoff date for last access
     * @return List of sessions not accessed since the cutoff date
     */
    @Query("SELECT s FROM Session s WHERE s.lastAccessedAt < :cutoffDate OR s.lastAccessedAt IS NULL")
    List<Session> findInactiveSessions(@Param("cutoffDate") LocalDateTime cutoffDate);

    /**
     * Count active sessions for a specific game
     *
     * @param gameName The name of the board game
     * @return Number of active sessions for the specified game
     */
    long countByGameNameAndIsActiveTrue(String gameName);

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
