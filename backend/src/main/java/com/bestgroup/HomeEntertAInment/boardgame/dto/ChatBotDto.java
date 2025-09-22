package com.bestgroup.HomeEntertAInment.boardgame.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for chatbot data transfer
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatBotDto {

    private Long id;
    private String name;
    private Boolean isActive;
    private Long sessionId;
    private List<ChatEntryDto> chatEntries;
    private LocalDateTime createdAt;
}
