package com.bestgroup.HomeEntertAInment.storybuilder.http.dto;

import com.bestgroup.HomeEntertAInment.storybuilder.model.AgeGroup;
import com.bestgroup.HomeEntertAInment.storybuilder.model.StoryLength;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Theme;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Twist;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateStoryRequest(
    @NotNull
    @Size(min = 1, max = 50)
    String hero,

    @NotNull
    String theme,

    @NotNull
    String tone,

    @NotNull
    String twist,

    String content,

    String coverImageUrl
) {
}
