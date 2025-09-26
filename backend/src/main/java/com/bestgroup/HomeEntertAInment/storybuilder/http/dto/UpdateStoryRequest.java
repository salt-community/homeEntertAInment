package com.bestgroup.HomeEntertAInment.storybuilder.http.dto;

import com.bestgroup.HomeEntertAInment.storybuilder.model.AgeGroup;
import com.bestgroup.HomeEntertAInment.storybuilder.model.StoryLength;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Theme;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Twist;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record UpdateStoryRequest(
    @NotNull
    UUID id,

    @Size(min = 1, max = 50)
    String character,

    List<Theme> theme,

    AgeGroup ageGroup,

    StoryLength storyLength,

    Twist twist,

    @Size(max = 200)
    String custom,

    String coverImageUrl
) {
}
