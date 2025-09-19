package com.bestgroup.HomeEntertAInment.entity;

import com.bestgroup.HomeEntertAInment.boardgame.dto.DecodedConvertApiResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a game session with players and rules
 */
@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "game_name", nullable = false)
    private String gameName;

    @Column(name = "session_name", nullable = false)
    private String sessionName;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Player> players = new ArrayList<>();

    @Embedded
    private GameRules rules;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }

    /**
     * Add a player to this session
     */
    public void addPlayer(Player player) {
        players.add(player);
        player.setSession(this);
    }

    /**
     * Remove a player from this session
     */
    public void removePlayer(Player player) {
        players.remove(player);
        player.setSession(null);
    }

    /**
     * Embedded class to store game rules from DecodedConvertApiResponse
     */
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GameRules {
        
        @Column(name = "rules_file_name")
        private String fileName;

        @Column(name = "rules_file_ext")
        private String fileExt;

        @Column(name = "rules_file_size")
        private Integer fileSize;

        @Column(name = "rules_coded_data", columnDefinition = "TEXT")
        private String codedData;

        @Column(name = "rules_decoded_data", columnDefinition = "TEXT")
        private String decodedData;

        /**
         * Create GameRules from DecodedConvertApiResponse
         */
        public static GameRules fromDecodedConvertApiResponse(DecodedConvertApiResponse response) {
            if (response == null) {
                return null;
            }
            return new GameRules(
                response.getFileName(),
                response.getFileExt(),
                response.getFileSize(),
                response.getCodedData(),
                response.getDecodedData()
            );
        }

        /**
         * Convert to DecodedConvertApiResponse
         */
        public DecodedConvertApiResponse toDecodedConvertApiResponse() {
            return new DecodedConvertApiResponse(
                fileName,
                fileExt,
                fileSize,
                codedData,
                decodedData
            );
        }
    }
}
