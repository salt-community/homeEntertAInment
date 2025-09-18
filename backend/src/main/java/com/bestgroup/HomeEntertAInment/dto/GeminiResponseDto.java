package com.bestgroup.HomeEntertAInment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * DTO for handling Gemini API responses
 * Based on the structure returned by Google's Gemini API
 */
public record GeminiResponseDto(List<Candidate> candidates) {
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Candidate(
            Content content
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Content(
            List<Part> parts
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Part(
            String text
    ) {
    }
}
