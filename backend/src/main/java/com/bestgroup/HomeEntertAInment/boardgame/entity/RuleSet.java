package com.bestgroup.HomeEntertAInment.boardgame.entity;

import com.bestgroup.HomeEntertAInment.boardgame.dto.DecodedConvertApiResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a rule set for board games
 * Stores converted rule files and their metadata
 */
@Entity
@Table(name = "rule_sets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RuleSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the rule set file
     */
    @Column(name = "file_name", nullable = false)
    private String fileName;

    /**
     * File extension of the rule set
     */
    @Column(name = "file_ext")
    private String fileExt;

    /**
     * Size of the original file in bytes
     */
    @Column(name = "file_size")
    private Integer fileSize;

    /**
     * Base64 encoded data of the original file
     */
    @Column(name = "coded_data", columnDefinition = "TEXT")
    private String codedData;

    /**
     * Decoded text content of the rule file
     */
    @Column(name = "decoded_data", columnDefinition = "TEXT")
    private String decodedData;

    /**
     * Timestamp when the rule set was created
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Clerk user ID who owns this rule set
     */
    @Column(name = "clerk_user_id", nullable = false)
    private String clerkUserId;

    /**
     * Create RuleSet from DecodedConvertApiResponse
     */
    public static RuleSet fromDecodedConvertApiResponse(DecodedConvertApiResponse response) {
        if (response == null) {
            return null;
        }
        return RuleSet.builder()
                .fileName(response.getFileName())
                .fileExt(response.getFileExt())
                .fileSize(response.getFileSize())
                .codedData(response.getCodedData())
                .decodedData(response.getDecodedData())
                .build();
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
