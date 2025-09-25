package com.bestgroup.HomeEntertAInment.storybuilder.service;

import com.bestgroup.HomeEntertAInment.service.GeminiStoryService;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.ImageRequest;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.ImageResponse;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.StoryRequest;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.StoryResponse;
import com.bestgroup.HomeEntertAInment.storybuilder.model.Story;
import com.bestgroup.HomeEntertAInment.storybuilder.model.StoryLength;
import com.bestgroup.HomeEntertAInment.storybuilder.model.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final GeminiStoryService geminiService;
    private final ImageService imageService;
    private final StoryRepository storyRepository;

    public StoryResponse generateStory(StoryRequest request) {
        // TODO Make better prompt

        String themes = request.theme().stream()
            .map(Enum::name)
            .collect(Collectors.joining(", "));

        // Define word count target for the story length
        String wordCountTarget = getWordCountTarget(request.storyLength());

        StringBuilder promptBuilder = new StringBuilder("""
            You are an assistant that generates children's stories in Markdown format.
            
            Requirements:
            - Do NOT include user instructions or free text in the story itself.
            - Only output valid Markdown (.md).
            - Start with a main title (#).
            - Divide the story into 2–4 short sections with creative and fitting subtitles (##).
            - Under each subtitle, write 1–3 short paragraphs suitable for the target age group.
            - Target length: %s
            - Do not add meta explanations or extra text outside the story.
            
            Story specification:
            - Character: %s
            - Theme: %s
            - Target age group: %s
            - Story length: %s
            
            Now, output the story in Markdown:
            """.formatted(
            wordCountTarget,
            request.character(),
            themes,
            request.ageGroup(),
            request.storyLength()
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
            .storyLength(request.storyLength())
            .theme(request.theme())
            .twist(request.twist())
            .custom(request.custom())
            .generatedStory(generatedStory)
            .build();

        storyRepository.save(story);

        return new StoryResponse(generatedStory);
    }

    public ImageResponse generateImage(ImageRequest imageRequest) {
        String url = imageService.generateImage(imageRequest.description(), 1024, 1024, 1);
        return new ImageResponse(url);
    }

    /**
     * Maps story length enum to word count target for AI prompt
     */
    private String getWordCountTarget(StoryLength storyLength) {
        return switch (storyLength) {
            case SHORT -> "approximately 500 words";
            case MEDIUM -> "approximately 1000 words";
            case FULL -> "approximately 1500 words";
        };
    }
}
