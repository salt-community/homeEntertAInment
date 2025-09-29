package com.bestgroup.HomeEntertAInment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieListDetailDto {
    private Long id;
    private String listName;
    private String description;
    private String searchCriteria;
    private LocalDateTime createdAt;
    private List<MovieResponseDto.MovieDto> movies;
}
