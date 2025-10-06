package com.bestgroup.HomeEntertAInment.storybuilder.controller;

import com.bestgroup.HomeEntertAInment.storybuilder.http.StoryController;
import com.bestgroup.HomeEntertAInment.storybuilder.http.dto.*;
import com.bestgroup.HomeEntertAInment.storybuilder.service.PdfConversionService;
import com.bestgroup.HomeEntertAInment.storybuilder.service.StoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StoryController.class)
class StoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StoryService storyService;

    @MockBean
    private PdfConversionService pdfConversionService;

    @Autowired
    private ObjectMapper objectMapper;

    private StoryRequest storyRequest;
    private StoryResponse storyResponse;
    private ImageRequest imageRequest;
    private ImageResponse imageResponse;
    private CreateStoryRequest createStoryRequest;
    private UpdateStoryRequest updateStoryRequest;
    private StoryDto storyDto;

    @BeforeEach
    void setUp() {
        storyRequest = new StoryRequest(
            "Dragon",
            List.of(com.bestgroup.HomeEntertAInment.storybuilder.model.Theme.ADVENTURE, com.bestgroup.HomeEntertAInment.storybuilder.model.Theme.FANTASY),
            com.bestgroup.HomeEntertAInment.storybuilder.model.AgeGroup.AGE_7_8,
            com.bestgroup.HomeEntertAInment.storybuilder.model.StoryLength.MEDIUM,
            com.bestgroup.HomeEntertAInment.storybuilder.model.Twist.SECRET_DOOR,
            "Custom details"
        );

        storyResponse = new StoryResponse("# Test Story\n\n## Chapter 1\n\nOnce upon a time...");

        imageRequest = new ImageRequest("A magical dragon");
        imageResponse = new ImageResponse("https://example.com/image.jpg");

        createStoryRequest = new CreateStoryRequest(
            "Hero",
            "Adventure, Fantasy",
            "Friendly",
            "SECRET_DOOR",
            "Story content",
            "https://example.com/cover.jpg"
        );

        updateStoryRequest = new UpdateStoryRequest(
            UUID.randomUUID(),
            "Updated Story",
            null,
            null,
            null,
            null,
            null,
            "https://example.com/new-cover.jpg"
        );

        storyDto = new StoryDto(
            UUID.randomUUID(),
            "Test Story",
            "Adventure",
            "Friendly",
            "SECRET_DOOR",
            "# Test Story\n\nContent here...",
            "https://example.com/cover.jpg",
            "user-123",
            "Test User",
            LocalDateTime.now()
        );
    }

    @Test
    @WithMockUser
    void generateStory_ShouldReturnOk_WhenValidRequest() throws Exception {
        // Arrange
        when(storyService.generateStory(any(StoryRequest.class), any()))
            .thenReturn(storyResponse);

        // Act & Assert
        mockMvc.perform(post("/api/story/generate")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(storyRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.story").value(storyResponse.story()));

        verify(storyService).generateStory(any(StoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void generateStory_ShouldReturnBadRequest_WhenInvalidRequest() throws Exception {
        // Arrange
        when(storyService.generateStory(any(StoryRequest.class), any()))
            .thenThrow(new IllegalArgumentException("Invalid input"));

        // Act & Assert
        mockMvc.perform(post("/api/story/generate")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(storyRequest)))
            .andExpect(status().isBadRequest());

        verify(storyService).generateStory(any(StoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void generateStory_ShouldReturnInternalServerError_WhenServiceThrowsException() throws Exception {
        // Arrange
        when(storyService.generateStory(any(StoryRequest.class), any()))
            .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(post("/api/story/generate")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(storyRequest)))
            .andExpect(status().isInternalServerError());

        verify(storyService).generateStory(any(StoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void generateImage_ShouldReturnOk_WhenValidRequest() throws Exception {
        // Arrange
        when(storyService.generateImage(any(ImageRequest.class)))
            .thenReturn(imageResponse);

        // Act & Assert
        mockMvc.perform(post("/api/story/image")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(imageRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.imageUrl").value(imageResponse.imageUrl()));

        verify(storyService).generateImage(any(ImageRequest.class));
    }

    @Test
    @WithMockUser
    void generateImage_ShouldReturnBadRequest_WhenInvalidRequest() throws Exception {
        // Arrange
        when(storyService.generateImage(any(ImageRequest.class)))
            .thenThrow(new IllegalArgumentException("Invalid input"));

        // Act & Assert
        mockMvc.perform(post("/api/story/image")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(imageRequest)))
            .andExpect(status().isBadRequest());

        verify(storyService).generateImage(any(ImageRequest.class));
    }

    @Test
    @WithMockUser
    void getStories_ShouldReturnOk_WithStoriesList() throws Exception {
        // Arrange
        List<StoryDto> stories = List.of(storyDto);
        when(storyService.getStoriesForUser(any())).thenReturn(stories);

        // Act & Assert
        mockMvc.perform(get("/api/stories"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].hero").value(storyDto.hero()));

        verify(storyService).getStoriesForUser(any());
    }

    @Test
    @WithMockUser
    void getStories_ShouldReturnInternalServerError_WhenServiceThrowsException() throws Exception {
        // Arrange
        when(storyService.getStoriesForUser(any()))
            .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(get("/api/stories"))
            .andExpect(status().isInternalServerError());

        verify(storyService).getStoriesForUser(any());
    }

    @Test
    @WithMockUser
    void getStory_ShouldReturnOk_WhenStoryFound() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.getStoryById(eq(storyId), any()))
            .thenReturn(Optional.of(storyDto));

        // Act & Assert
        mockMvc.perform(get("/api/stories/{id}", storyId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hero").value(storyDto.hero()));

        verify(storyService).getStoryById(eq(storyId), any());
    }

    @Test
    @WithMockUser
    void getStory_ShouldReturnNotFound_WhenStoryNotFound() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.getStoryById(eq(storyId), any()))
            .thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/api/stories/{id}", storyId))
            .andExpect(status().isNotFound());

        verify(storyService).getStoryById(eq(storyId), any());
    }

    @Test
    @WithMockUser
    void getStory_ShouldReturnInternalServerError_WhenServiceThrowsException() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.getStoryById(eq(storyId), any()))
            .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(get("/api/stories/{id}", storyId))
            .andExpect(status().isInternalServerError());

        verify(storyService).getStoryById(eq(storyId), any());
    }

    @Test
    @WithMockUser
    void createStory_ShouldReturnOk_WhenValidRequest() throws Exception {
        // Arrange
        when(storyService.createStory(any(CreateStoryRequest.class), any()))
            .thenReturn(storyDto);

        // Act & Assert
        mockMvc.perform(post("/api/stories")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createStoryRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hero").value(storyDto.hero()));

        verify(storyService).createStory(any(CreateStoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void createStory_ShouldReturnBadRequest_WhenInvalidRequest() throws Exception {
        // Arrange
        when(storyService.createStory(any(CreateStoryRequest.class), any()))
            .thenThrow(new IllegalArgumentException("Invalid input"));

        // Act & Assert
        mockMvc.perform(post("/api/stories")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createStoryRequest)))
            .andExpect(status().isBadRequest());

        verify(storyService).createStory(any(CreateStoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void createStory_ShouldReturnInternalServerError_WhenServiceThrowsException() throws Exception {
        // Arrange
        when(storyService.createStory(any(CreateStoryRequest.class), any()))
            .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(post("/api/stories")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createStoryRequest)))
            .andExpect(status().isInternalServerError());

        verify(storyService).createStory(any(CreateStoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void updateStory_ShouldReturnOk_WhenStoryFound() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.updateStory(any(UpdateStoryRequest.class), any()))
            .thenReturn(Optional.of(storyDto));

        // Act & Assert
        mockMvc.perform(put("/api/stories/{id}", storyId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateStoryRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hero").value(storyDto.hero()));

        verify(storyService).updateStory(any(UpdateStoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void updateStory_ShouldReturnNotFound_WhenStoryNotFound() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.updateStory(any(UpdateStoryRequest.class), any()))
            .thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(put("/api/stories/{id}", storyId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateStoryRequest)))
            .andExpect(status().isNotFound());

        verify(storyService).updateStory(any(UpdateStoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void updateStory_ShouldReturnBadRequest_WhenInvalidRequest() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.updateStory(any(UpdateStoryRequest.class), any()))
            .thenThrow(new IllegalArgumentException("Invalid input"));

        // Act & Assert
        mockMvc.perform(put("/api/stories/{id}", storyId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateStoryRequest)))
            .andExpect(status().isBadRequest());

        verify(storyService).updateStory(any(UpdateStoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void updateStory_ShouldReturnInternalServerError_WhenServiceThrowsException() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.updateStory(any(UpdateStoryRequest.class), any()))
            .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(put("/api/stories/{id}", storyId)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateStoryRequest)))
            .andExpect(status().isInternalServerError());

        verify(storyService).updateStory(any(UpdateStoryRequest.class), any());
    }

    @Test
    @WithMockUser
    void deleteStory_ShouldReturnNoContent_WhenStoryDeleted() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.deleteStory(eq(storyId), any())).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/stories/{id}", storyId)
                .with(csrf()))
            .andExpect(status().isNoContent());

        verify(storyService).deleteStory(eq(storyId), any());
    }

    @Test
    @WithMockUser
    void deleteStory_ShouldReturnNotFound_WhenStoryNotFound() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.deleteStory(eq(storyId), any())).thenReturn(false);

        // Act & Assert
        mockMvc.perform(delete("/api/stories/{id}", storyId)
                .with(csrf()))
            .andExpect(status().isNotFound());

        verify(storyService).deleteStory(eq(storyId), any());
    }

    @Test
    @WithMockUser
    void deleteStory_ShouldReturnInternalServerError_WhenServiceThrowsException() throws Exception {
        // Arrange
        UUID storyId = UUID.randomUUID();
        when(storyService.deleteStory(eq(storyId), any()))
            .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(delete("/api/stories/{id}", storyId)
                .with(csrf()))
            .andExpect(status().isInternalServerError());

        verify(storyService).deleteStory(eq(storyId), any());
    }

    @Test
    @WithMockUser
    void convertStoryToPdf_ShouldReturnBadRequest_WhenEmptyContent() throws Exception {
        // Arrange
        MarkdownToPdfRequest request = new MarkdownToPdfRequest("", null);

        // Act & Assert
        mockMvc.perform(post("/api/story/convert-to-pdf")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());

        verify(pdfConversionService, never()).convertMarkdownToPdf(anyString(), anyString());
    }

    @Test
    @WithMockUser
    void convertStoryToPdf_ShouldReturnBadRequest_WhenNullContent() throws Exception {
        // Arrange
        MarkdownToPdfRequest request = new MarkdownToPdfRequest(null, null);

        // Act & Assert
        mockMvc.perform(post("/api/story/convert-to-pdf")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());

        verify(pdfConversionService, never()).convertMarkdownToPdf(anyString(), anyString());
    }

    @Test
    @WithMockUser
    void convertStoryToPdf_ShouldReturnBadRequest_WhenServiceThrowsIllegalArgumentException() throws Exception {
        // Arrange
        MarkdownToPdfRequest request = new MarkdownToPdfRequest(
            "# Test Story\n\nContent here...",
            "https://example.com/cover.jpg"
        );

        when(pdfConversionService.convertMarkdownToPdf(anyString(), anyString()))
            .thenThrow(new IllegalArgumentException("Invalid request"));

        // Act & Assert
        mockMvc.perform(post("/api/story/convert-to-pdf")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());

        verify(pdfConversionService).convertMarkdownToPdf(anyString(), anyString());
    }

    @Test
    @WithMockUser
    void convertStoryToPdf_ShouldReturnInternalServerError_WhenServiceThrowsException() throws Exception {
        // Arrange
        MarkdownToPdfRequest request = new MarkdownToPdfRequest(
            "# Test Story\n\nContent here...",
            "https://example.com/cover.jpg"
        );

        when(pdfConversionService.convertMarkdownToPdf(anyString(), anyString()))
            .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(post("/api/story/convert-to-pdf")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isInternalServerError());

        verify(pdfConversionService).convertMarkdownToPdf(anyString(), anyString());
    }
}
