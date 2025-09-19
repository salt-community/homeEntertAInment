package com.bestgroup.HomeEntertAInment.boardgame.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a game session for the Board Game Rule Inspector
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
     * List of players in this session
     */
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Player> players = new ArrayList<>();

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
     * Session metadata for additional context
     */
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    /**
     * Reference to the rule set used in this session
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_set_id")
    private RuleSet ruleSet;
}
