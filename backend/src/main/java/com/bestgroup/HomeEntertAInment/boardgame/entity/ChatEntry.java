package com.bestgroup.HomeEntertAInment.boardgame.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a chat entry in a board game session
 * Stores individual messages between players and the AI assistant
 */
@Entity
@Table(name = "chat_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Content of the chat message
     */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * Creator of the message - either "PLAYER" or "AI"
     */
    @Column(name = "creator", nullable = false)
    private String creator;

    /**
     * Reference to the chatbot this entry belongs to
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatbot_id", nullable = false)
    @JsonIgnore
    private ChatBot chatBot;

    /**
     * Reference to the session this entry belongs to
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @JsonIgnore
    private Session session;

    /**
     * Timestamp when the chat entry was created
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
