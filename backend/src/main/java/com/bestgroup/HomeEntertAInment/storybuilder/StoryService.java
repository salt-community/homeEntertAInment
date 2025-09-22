package com.bestgroup.HomeEntertAInment.storybuilder;

import com.bestgroup.HomeEntertAInment.service.GeminiStoryService;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.StoryRequest;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.StoryResponse;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Story;
import com.bestgroup.HomeEntertAInment.storybuilder.model.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final GeminiStoryService geminiService;
    private final StoryRepository storyRepository;

    public StoryResponse generateStory(StoryRequest request) {
        // TODO Make better prompt

        String themes = request.theme().stream()
            .map(Enum::name)
            .collect(Collectors.joining(", "));

        StringBuilder promptBuilder = new StringBuilder("""
            Write a short children's story.
            Hero: %s
            Theme: %s
            Target age group: %s
            """.formatted(
            request.character(),
            themes,
            request.ageGroup()
        ));

        if (request.twist() != null) {
            promptBuilder.append("Twist: ").append(request.twist()).append("\n");
        }

        if (request.custom() != null && !request.custom().isBlank()) {
            promptBuilder.append("Extra details: ").append(request.custom()).append("\n");
        }

        String generatedStory = geminiService.sendStoryPrompt(promptBuilder.toString());

        Story story = Story.builder()
            .character(request.character())
            .ageGroup(request.ageGroup())
            .theme(request.theme())
            .twist(request.twist())
            .custom(request.custom())
            .generatedStory(generatedStory)
            .build();

        storyRepository.save(story);

        return new StoryResponse(generatedStory);
    }

}
