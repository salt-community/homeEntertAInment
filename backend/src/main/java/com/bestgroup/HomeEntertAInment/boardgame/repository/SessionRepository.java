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

    /**
     * Find all sessions for a specific Clerk user
     *
     * @param clerkUserId The Clerk user ID
     * @return List of sessions owned by the user
     */
    List<Session> findByClerkUserId(String clerkUserId);

    /**
     * Find active sessions for a specific Clerk user
     *
     * @param clerkUserId The Clerk user ID
     * @return List of active sessions owned by the user
     */
    List<Session> findByClerkUserIdAndIsActiveTrue(String clerkUserId);

    /**
     * Find sessions by Clerk user ID and game state
     *
     * @param clerkUserId The Clerk user ID
     * @param gameState The current game state
     * @return List of sessions owned by the user in the specified game state
     */
    List<Session> findByClerkUserIdAndGameState(String clerkUserId, String gameState);

    /**
     * Find a specific session by ID and Clerk user ID
     *
     * @param id The session ID
     * @param clerkUserId The Clerk user ID
     * @return Optional containing the session if found and owned by user
     */
    Optional<Session> findByIdAndClerkUserId(Long id, String clerkUserId);
}
