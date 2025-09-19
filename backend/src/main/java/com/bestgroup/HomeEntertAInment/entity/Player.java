package com.bestgroup.HomeEntertAInment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a player in a game session
 */
@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String email;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private Session session;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }
}
