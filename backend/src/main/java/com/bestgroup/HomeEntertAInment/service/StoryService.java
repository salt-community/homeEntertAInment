package com.bestgroup.HomeEntertAInment.service;

import com.bestgroup.HomeEntertAInment.dto.story.StoryRequest;
import com.bestgroup.HomeEntertAInment.dto.story.StoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final GeminiService geminiService;

    public StoryResponse generateStory(StoryRequest request) {
        //TODO Make better prompt
        String prompt = """
            Write a short children's story.
            Hero: %s
            Theme: %s
            Tone: %s
            Extra twist: %s
            """.formatted(
            request.hero(),
            request.theme(),
            request.tone(),
            request.twist()
        );

        String storyText = geminiService.sendTestPrompt(prompt);

        return new StoryResponse(storyText);
    }
}
