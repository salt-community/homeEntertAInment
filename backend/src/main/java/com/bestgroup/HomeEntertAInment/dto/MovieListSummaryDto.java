package com.bestgroup.HomeEntertAInment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieListSummaryDto {
    private Long id;
    private String listName;
    private String description;
    private Integer movieCount;
    private LocalDateTime createdAt;
}
