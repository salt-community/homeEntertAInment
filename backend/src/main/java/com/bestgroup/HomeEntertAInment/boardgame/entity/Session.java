package com.bestgroup.HomeEntertAInment.boardgame.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a game session for the Board Game Rule Inspector
 * Tracks user sessions, game state, and rule context for providing contextual answers
 */
@Entity
@Table(name = "game_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique session identifier for tracking user interactions
     */
    @Column(name = "session_id", unique = true, nullable = false)
    private String sessionId;

    /**
     * Name of the board game being played
     */
    @Column(name = "game_name", nullable = false)
    private String gameName;

    /**
     * Current game state or context (e.g., "setup", "playing", "end_game")
     */
    @Column(name = "game_state")
    private String gameState;

    /**
     * Number of players in the current game
     */
    @Column(name = "player_count")
    private Integer playerCount;

    /**
     * Current turn or round number
     */
    @Column(name = "current_turn")
    private Integer currentTurn;

    /**
     * Additional game context stored as JSON
     * Can include player positions, scores, special conditions, etc.
     */
    @Column(name = "game_context", columnDefinition = "TEXT")
    private String gameContext;

    /**
     * Last question asked by the user
     */
    @Column(name = "last_question", columnDefinition = "TEXT")
    private String lastQuestion;

    /**
     * Last answer provided by the rule engine
     */
    @Column(name = "last_answer", columnDefinition = "TEXT")
    private String lastAnswer;

    /**
     * Whether the session is currently active
     */
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Timestamp when the session was created
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the session was last updated
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Timestamp when the session was last accessed
     */
    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    /**
     * Optional user identifier for personalization
     */
    @Column(name = "user_id")
    private String userId;

    /**
     * Session metadata for additional context
     */
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;
}
