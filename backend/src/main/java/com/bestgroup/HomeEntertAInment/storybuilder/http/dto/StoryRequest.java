package com.bestgroup.HomeEntertAInment.storybuilder.http.dto;

import com.bestgroup.HomeEntertAInment.storybuilder.model.AgeGroup;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Theme;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Twist;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StoryRequest(
    @NotNull
    @Size(min = 1, max = 50)
    String character,

    @NotNull
    Theme theme,

    AgeGroup ageGroup,

    Twist twist,

    @Size(max = 200)
    String custom
) {
}

