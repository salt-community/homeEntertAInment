package com.bestgroup.HomeEntertAInment.storybuilder.service;

import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import com.bestgroup.HomeEntertAInment.service.GeminiStoryService;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.*;
import com.bestgroup.HomeEntertAInment.storybuilder.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StoryServiceTest {

    @Mock
    private GeminiStoryService geminiService;

    @Mock
    private ImageService imageService;

    @Mock
    private StoryRepository storyRepository;

    @Mock
    private ClerkUserExtractor clerkUserExtractor;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private StoryService storyService;

    private static final String TEST_USER_ID = "test-user-123";
    private static final String TEST_STORY_CONTENT = "# Test Story\n\n## Chapter 1\n\nOnce upon a time...";

    @BeforeEach
    void setUp() {
        when(clerkUserExtractor.extractClerkUserIdRequired(authentication)).thenReturn(TEST_USER_ID);
    }

    @Test
    void generateStory_ShouldReturnStoryResponse_WhenValidRequest() {
        // Arrange
        StoryRequest request = new StoryRequest(
            "Dragon",
            List.of(Theme.ADVENTURE, Theme.FANTASY),
            AgeGroup.AGE_7_8,
            StoryLength.MEDIUM,
            Twist.SECRET_DOOR,
            "Custom details"
        );

        when(geminiService.sendStoryPrompt(anyString())).thenReturn(TEST_STORY_CONTENT);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        StoryResponse response = storyService.generateStory(request, authentication);

        // Assert
        assertNotNull(response);
        assertEquals(TEST_STORY_CONTENT, response.story());

        verify(geminiService).sendStoryPrompt(contains("Dragon"));
        verify(geminiService).sendStoryPrompt(contains("ADVENTURE, FANTASY"));
        verify(geminiService).sendStoryPrompt(contains("AGE_7_8"));
        verify(geminiService).sendStoryPrompt(contains("MEDIUM"));
        verify(geminiService).sendStoryPrompt(contains("SECRET_DOOR"));
        verify(geminiService).sendStoryPrompt(contains("Custom details"));
        verify(storyRepository).save(any(Story.class));
    }

    @Test
    void generateStory_ShouldHandleRequestWithoutOptionalFields() {
        // Arrange
        StoryRequest request = new StoryRequest(
            "Princess",
            List.of(Theme.ADVENTURE),
            AgeGroup.AGE_5_6,
            StoryLength.SHORT,
            null,
            null
        );

        when(geminiService.sendStoryPrompt(anyString())).thenReturn(TEST_STORY_CONTENT);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        StoryResponse response = storyService.generateStory(request, authentication);

        // Assert
        assertNotNull(response);
        assertEquals(TEST_STORY_CONTENT, response.story());

        verify(geminiService).sendStoryPrompt(argThat(prompt -> !prompt.contains("Twist:")));
        verify(geminiService).sendStoryPrompt(argThat(prompt -> !prompt.contains("Extra details:")));
    }

    @Test
    void getStoriesForUser_ShouldReturnUserStories() {
        // Arrange
        List<Story> mockStories = createMockStories();
        when(storyRepository.findByUserIdOrderByCreatedAtDesc(TEST_USER_ID))
            .thenReturn(mockStories);

        // Act
        List<StoryDto> result = storyService.getStoriesForUser(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Dragon Adventure", result.get(0).hero());
        assertEquals("Princess Tale", result.get(1).hero());
        verify(storyRepository).findByUserIdOrderByCreatedAtDesc(TEST_USER_ID);
    }

    @Test
    void getStoryById_ShouldReturnStory_WhenFound() {
        // Arrange
        UUID storyId = UUID.randomUUID();
        Story mockStory = createMockStory(storyId, "Test Story");
        when(storyRepository.findByIdAndUserId(storyId, TEST_USER_ID))
            .thenReturn(Optional.of(mockStory));

        // Act
        Optional<StoryDto> result = storyService.getStoryById(storyId, authentication);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Story", result.get().hero());
        verify(storyRepository).findByIdAndUserId(storyId, TEST_USER_ID);
    }

    @Test
    void getStoryById_ShouldReturnEmpty_WhenNotFound() {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyRepository.findByIdAndUserId(storyId, TEST_USER_ID))
            .thenReturn(Optional.empty());

        // Act
        Optional<StoryDto> result = storyService.getStoryById(storyId, authentication);

        // Assert
        assertFalse(result.isPresent());
        verify(storyRepository).findByIdAndUserId(storyId, TEST_USER_ID);
    }

    @Test
    void createStory_ShouldCreateAndReturnStory() {
        // Arrange
        CreateStoryRequest request = new CreateStoryRequest(
            "Hero",
            "Adventure, Fantasy",
            "Friendly",
            "SECRET_DOOR",
            "Story content",
            "https://example.com/cover.jpg"
        );

        when(geminiService.sendStoryPrompt(anyString())).thenReturn(TEST_STORY_CONTENT);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> {
            Story story = invocation.getArgument(0);
            return Story.builder()
                .id(UUID.randomUUID())
                .character(story.getCharacter())
                .ageGroup(story.getAgeGroup())
                .storyLength(story.getStoryLength())
                .theme(story.getTheme())
                .twist(story.getTwist())
                .custom(story.getCustom())
                .generatedStory(story.getGeneratedStory())
                .userId(story.getUserId())
                .userName(story.getUserName())
                .createdAt(story.getCreatedAt())
                .coverImageUrl(story.getCoverImageUrl())
                .build();
        });

        // Act
        StoryDto result = storyService.createStory(request, authentication);

        // Assert
        assertNotNull(result);
        assertEquals("Hero", result.hero());
        assertEquals("ADVENTURE, FANTASY", result.theme());
        assertEquals("Friendly", result.tone());
        assertEquals("SECRET_DOOR", result.twist());
        assertEquals("https://example.com/cover.jpg", result.coverImageUrl());
        verify(storyRepository).save(any(Story.class));
    }

    @Test
    void updateStory_ShouldUpdateAndReturnStory_WhenFound() {
        // Arrange
        UUID storyId = UUID.randomUUID();
        Story existingStory = createMockStory(storyId, "Original Story");
        UpdateStoryRequest request = new UpdateStoryRequest(
            storyId,
            "Updated Story",
            null,
            null,
            null,
            null,
            null,
            "https://example.com/new-cover.jpg"
        );

        when(storyRepository.findByIdAndUserId(storyId, TEST_USER_ID))
            .thenReturn(Optional.of(existingStory));
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Optional<StoryDto> result = storyService.updateStory(request, authentication);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Updated Story", result.get().hero());
        assertEquals("https://example.com/new-cover.jpg", result.get().coverImageUrl());
        verify(storyRepository).save(any(Story.class));
    }

    @Test
    void updateStory_ShouldReturnEmpty_WhenStoryNotFound() {
        // Arrange
        UUID storyId = UUID.randomUUID();
        UpdateStoryRequest request = new UpdateStoryRequest(
            storyId,
            "Updated Story",
            null,
            null,
            null,
            null,
            null,
            null
        );

        when(storyRepository.findByIdAndUserId(storyId, TEST_USER_ID))
            .thenReturn(Optional.empty());

        // Act
        Optional<StoryDto> result = storyService.updateStory(request, authentication);

        // Assert
        assertFalse(result.isPresent());
        verify(storyRepository, never()).save(any(Story.class));
    }

    @Test
    void deleteStory_ShouldReturnTrue_WhenStoryExists() {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyRepository.existsByIdAndUserId(storyId, TEST_USER_ID))
            .thenReturn(true);

        // Act
        boolean result = storyService.deleteStory(storyId, authentication);

        // Assert
        assertTrue(result);
        verify(storyRepository).deleteByIdAndUserId(storyId, TEST_USER_ID);
    }

    @Test
    void deleteStory_ShouldReturnFalse_WhenStoryDoesNotExist() {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyRepository.existsByIdAndUserId(storyId, TEST_USER_ID))
            .thenReturn(false);

        // Act
        boolean result = storyService.deleteStory(storyId, authentication);

        // Assert
        assertFalse(result);
        verify(storyRepository, never()).deleteByIdAndUserId(any(), any());
    }

    @Test
    void getWordCountTarget_ShouldReturnCorrectTargets() {
        // Test through generateStory method
        StoryRequest shortRequest = new StoryRequest(
            "Test", List.of(Theme.ADVENTURE), AgeGroup.AGE_7_8, StoryLength.SHORT, null, null
        );
        StoryRequest mediumRequest = new StoryRequest(
            "Test", List.of(Theme.ADVENTURE), AgeGroup.AGE_7_8, StoryLength.MEDIUM, null, null
        );
        StoryRequest fullRequest = new StoryRequest(
            "Test", List.of(Theme.ADVENTURE), AgeGroup.AGE_7_8, StoryLength.FULL, null, null
        );

        when(geminiService.sendStoryPrompt(anyString())).thenReturn(TEST_STORY_CONTENT);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        storyService.generateStory(shortRequest, authentication);
        storyService.generateStory(mediumRequest, authentication);
        storyService.generateStory(fullRequest, authentication);

        // Assert
        verify(geminiService).sendStoryPrompt(contains("approximately 500 words"));
        verify(geminiService).sendStoryPrompt(contains("approximately 1000 words"));
        verify(geminiService).sendStoryPrompt(contains("approximately 1500 words"));
    }

    @Test
    void parseThemeString_ShouldHandleValidThemes() {
        // Test through createStory method
        CreateStoryRequest request = new CreateStoryRequest(
            "Hero",
            "ADVENTURE, FANTASY, ADVENTURE",
            "Friendly",
            "NONE",
            "Story content",
            null
        );

        when(geminiService.sendStoryPrompt(anyString())).thenReturn(TEST_STORY_CONTENT);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        StoryDto result = storyService.createStory(request, authentication);

        // Assert
        assertNotNull(result);
        assertEquals("ADVENTURE, FANTASY, ADVENTURE", result.theme());
    }

    @Test
    void parseThemeString_ShouldHandleInvalidThemes() {
        // Test through createStory method
        CreateStoryRequest request = new CreateStoryRequest(
            "Hero",
            "INVALID_THEME, ADVENTURE, ANOTHER_INVALID",
            "Friendly",
            "NONE",
            "Story content",
            null
        );

        when(geminiService.sendStoryPrompt(anyString())).thenReturn(TEST_STORY_CONTENT);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        StoryDto result = storyService.createStory(request, authentication);

        // Assert
        assertNotNull(result);
        assertEquals("ADVENTURE", result.theme()); // Only valid theme should remain
    }

    @Test
    void parseTwistString_ShouldHandleValidTwists() {
        // Test through createStory method
        CreateStoryRequest request = new CreateStoryRequest(
            "Hero",
            "ADVENTURE",
            "Friendly",
            "SECRET_DOOR",
            "Story content",
            null
        );

        when(geminiService.sendStoryPrompt(anyString())).thenReturn(TEST_STORY_CONTENT);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        StoryDto result = storyService.createStory(request, authentication);

        // Assert
        assertNotNull(result);
        assertEquals("SECRET_DOOR", result.twist());
    }

    @Test
    void parseTwistString_ShouldHandleNoneAndInvalidTwists() {
        // Test through createStory method
        CreateStoryRequest request = new CreateStoryRequest(
            "Hero",
            "ADVENTURE",
            "Friendly",
            "INVALID_TWIST",
            "Story content",
            null
        );

        when(geminiService.sendStoryPrompt(anyString())).thenReturn(TEST_STORY_CONTENT);
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        StoryDto result = storyService.createStory(request, authentication);

        // Assert
        assertNotNull(result);
        assertEquals("NONE", result.twist()); // Should default to NONE for invalid twists
    }

    private List<Story> createMockStories() {
        List<Story> stories = new ArrayList<>();
        stories.add(createMockStory(UUID.randomUUID(), "Dragon Adventure"));
        stories.add(createMockStory(UUID.randomUUID(), "Princess Tale"));
        return stories;
    }

    private Story createMockStory(UUID id, String character) {
        return Story.builder()
            .id(id)
            .character(character)
            .ageGroup(AgeGroup.AGE_7_8)
            .storyLength(StoryLength.MEDIUM)
            .theme(List.of(Theme.ADVENTURE))
            .twist(Twist.SECRET_DOOR)
            .custom("Test custom")
            .generatedStory(TEST_STORY_CONTENT)
            .userId(TEST_USER_ID)
            .userName("Test User")
            .createdAt(LocalDateTime.now())
            .build();
    }
}
