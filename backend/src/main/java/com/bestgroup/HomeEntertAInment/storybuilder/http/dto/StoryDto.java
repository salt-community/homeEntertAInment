package com.bestgroup.HomeEntertAInment.storybuilder.http.dto;

import com.bestgroup.HomeEntertAInment.storybuilder.model.AgeGroup;
import com.bestgroup.HomeEntertAInment.storybuilder.model.StoryLength;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Theme;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Twist;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record StoryDto(
    UUID id,
    String hero, // Changed from character to hero to match frontend
    String theme, // Changed from List<Theme> to String to match frontend
    String tone, // Added tone field
    String twist, // Changed from Twist enum to String
    String content, // Changed from generatedStory to content
    String coverImageUrl,
    String userId,
    String userName,
    LocalDateTime createdAt
) {
}
