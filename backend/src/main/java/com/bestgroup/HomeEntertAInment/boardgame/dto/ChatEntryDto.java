package com.bestgroup.HomeEntertAInment.boardgame.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for chat entry data transfer
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatEntryDto {

    private Long id;
    private Long chatbotId;
    private Long sessionId;
    private String creator;
    private String content;
    private LocalDateTime createdAt;
}
