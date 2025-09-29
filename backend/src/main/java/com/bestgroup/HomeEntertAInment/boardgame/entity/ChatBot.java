package com.bestgroup.HomeEntertAInment.boardgame.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
 * Entity representing a chatbot for a board game session
 * Each session has one chatbot that handles rule questions
 */
@Entity
@Table(name = "chatbots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatBot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name or identifier for the chatbot
     */
    @Column(name = "name", nullable = false)
    @Builder.Default
    private String name = "Board Game Rules Assistant";

    /**
     * Whether the chatbot is currently active
     */
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    /**
     * List of chat entries for this chatbot
     */
    @OneToMany(mappedBy = "chatBot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ChatEntry> chatEntries = new ArrayList<>();

    /**
     * Reference to the game session this chatbot belongs to
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", unique = true)
    @JsonIgnore
    private Session session;

    /**
     * Timestamp when the chatbot was created
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Clerk user ID who owns this chatbot
     */
    @Column(name = "clerk_user_id", nullable = false)
    private String clerkUserId;
}
