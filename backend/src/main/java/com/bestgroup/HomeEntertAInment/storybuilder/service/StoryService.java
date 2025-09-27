package com.bestgroup.HomeEntertAInment.storybuilder.service;

import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import com.bestgroup.HomeEntertAInment.service.GeminiStoryService;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.*;
import com.bestgroup.HomeEntertAInment.storybuilder.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final GeminiStoryService geminiService;
    private final ImageService imageService;
    private final StoryRepository storyRepository;
    private final ClerkUserExtractor clerkUserExtractor;

    public StoryResponse generateStory(StoryRequest request, Authentication authentication) {
        // Extract user ID from Clerk authentication
        String userId = clerkUserExtractor.extractClerkUserIdRequired(authentication);

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
            .userId(userId)
            .build();

        storyRepository.save(story);

        return new StoryResponse(generatedStory);
    }

    public ImageResponse generateImage(ImageRequest imageRequest) {
        String url = imageService.generateImage(imageRequest.description(), 512, 512, 1);
        return new ImageResponse(url);
    }

    /**
     * Get all stories for the current user
     */
    public List<StoryDto> getStoriesForUser(Authentication authentication) {
        String userId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
        System.out.println("Getting stories for user ID: " + userId);
        
        List<Story> stories = storyRepository.findByUserIdOrderByCreatedAtDesc(userId);
        System.out.println("Found " + stories.size() + " stories in database");
        
        List<StoryDto> storyDtos = stories.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
            
        System.out.println("Converted to " + storyDtos.size() + " DTOs");
        return storyDtos;
    }

    /**
     * Get a specific story by ID for the current user
     */
    public Optional<StoryDto> getStoryById(UUID id, Authentication authentication) {
        String userId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
        return storyRepository.findByIdAndUserId(id, userId)
            .map(this::convertToDto);
    }

    /**
     * Create a new story for the current user
     */
    public StoryDto createStory(CreateStoryRequest request, Authentication authentication) {
        String userId = clerkUserExtractor.extractClerkUserIdRequired(authentication);

        // Generate the story content using Gemini
        String promptBuilder = """
            You are an assistant that generates children's stories in Markdown format.
            
            Requirements:
            - Do NOT include user instructions or free text in the story itself.
            - Only output valid Markdown (.md).
            - Start with a main title (#).
            - Divide the story into 2–4 short sections with creative and fitting subtitles (##).
            - Under each subtitle, write 1–3 short paragraphs suitable for the target age group.
            - Target length: approximately 1000 words
            - Do not add meta explanations or extra text outside the story.
            
            Story specification:
            - Character: %s
            - Theme: %s
            - Tone: %s
            - Twist: %s
            
            Now, output the story in Markdown:
            """.formatted(
            request.hero(),
            request.theme(),
            request.tone(),
            request.twist()
        );

        String generatedStory = geminiService.sendStoryPrompt(promptBuilder);

        // Parse theme string back to enum list for storage
        List<Theme> themeList = parseThemeString(request.theme());

        Story story = Story.builder()
            .character(request.hero())
            .ageGroup(AgeGroup.AGE_7_8) // Default age group
            .storyLength(StoryLength.MEDIUM) // Default story length
            .theme(themeList)
            .twist(parseTwistString(request.twist()))
            .custom(null) // No custom field in new format
            .generatedStory(generatedStory)
            .userId(userId)
            .coverImageUrl(request.coverImageUrl())
            .build();

        Story savedStory = storyRepository.save(story);
        return convertToDto(savedStory);
    }

    /**
     * Update an existing story for the current user
     */
    public Optional<StoryDto> updateStory(UpdateStoryRequest request, Authentication authentication) {
        String userId = clerkUserExtractor.extractClerkUserIdRequired(authentication);

        return storyRepository.findByIdAndUserId(request.id(), userId)
            .map(existingStory -> {
                Story updatedStory = Story.builder()
                    .id(existingStory.getId())
                    .character(request.character() != null ? request.character() : existingStory.getCharacter())
                    .ageGroup(request.ageGroup() != null ? request.ageGroup() : existingStory.getAgeGroup())
                    .storyLength(request.storyLength() != null ? request.storyLength() : existingStory.getStoryLength())
                    .theme(request.theme() != null ? request.theme() : existingStory.getTheme())
                    .twist(request.twist() != null ? request.twist() : existingStory.getTwist())
                    .custom(request.custom() != null ? request.custom() : existingStory.getCustom())
                    .generatedStory(existingStory.getGeneratedStory()) // Keep existing story content
                    .userId(existingStory.getUserId())
                    .userName(existingStory.getUserName())
                    .createdAt(existingStory.getCreatedAt())
                    .coverImageUrl(request.coverImageUrl() != null ? request.coverImageUrl() : existingStory.getCoverImageUrl())
                    .build();

                Story savedStory = storyRepository.save(updatedStory);
                return convertToDto(savedStory);
            });
    }

    /**
     * Delete a story for the current user
     */
    @Transactional
    public boolean deleteStory(UUID id, Authentication authentication) {
        String userId = clerkUserExtractor.extractClerkUserIdRequired(authentication);

        if (storyRepository.existsByIdAndUserId(id, userId)) {
            storyRepository.deleteByIdAndUserId(id, userId);
            return true;
        }
        return false;
    }

    /**
     * Convert Story entity to StoryDto
     */
    private StoryDto convertToDto(Story story) {
        // Convert theme list to string
        String themeString = story.getTheme().stream()
            .map(Enum::name)
            .collect(Collectors.joining(", "));

        return new StoryDto(
            story.getId(),
            story.getCharacter(), // hero
            themeString, // theme as string
            "Friendly", // tone (default)
            story.getTwist() != null ? story.getTwist().name() : "NONE", // twist as string
            story.getGeneratedStory(), // content
            story.getCoverImageUrl(),
            story.getUserId(),
            story.getUserName(),
            story.getCreatedAt()
        );
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

    /**
     * Parse theme string back to enum list
     */
    private List<Theme> parseThemeString(String themeString) {
        if (themeString == null || themeString.trim().isEmpty()) {
            return List.of(Theme.ADVENTURE); // Default theme
        }

        return Arrays.stream(themeString.split(","))
            .map(String::trim)
            .map(this::parseThemeEnum)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    /**
     * Parse individual theme string to enum
     */
    private Theme parseThemeEnum(String themeName) {
        try {
            return Theme.valueOf(themeName.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null; // Skip invalid themes
        }
    }

    /**
     * Parse twist string to enum
     */
    private Twist parseTwistString(String twistString) {
        if (twistString == null || twistString.trim().isEmpty() || "NONE".equals(twistString)) {
            return null;
        }

        try {
            return Twist.valueOf(twistString.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null; // Return null for invalid twists
        }
    }
}
