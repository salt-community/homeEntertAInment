package com.bestgroup.HomeEntertAInment.boardgame.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new chat entry
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateChatEntryRequest {

    private String content;
    private String creator;
}
