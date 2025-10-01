package com.bestgroup.HomeEntertAInment.boardgame.controller;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatBotDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatEntryDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.CreateChatEntryRequest;
import com.bestgroup.HomeEntertAInment.boardgame.service.ChatBotService;
import com.bestgroup.HomeEntertAInment.boardgame.service.ChatEntryService;
import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for ChatController
 */
@WebMvcTest(ChatController.class)
@TestPropertySource(properties = {
    "CONVERT_API_TOKEN=test-token",
    "GEMINI_API_KEY=test-key"
})
class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ChatEntryService chatEntryService;

    @MockBean
    private ChatBotService chatBotService;

    @MockBean
    private ClerkUserExtractor clerkUserExtractor;

    @Autowired
    private ObjectMapper objectMapper;

    private ChatEntryDto testChatEntry;
    private ChatBotDto testChatBot;
    private final String TEST_USER_ID = "test-user-123";
    private final Long TEST_SESSION_ID = 1L;

    @BeforeEach
    void setUp() {
        testChatEntry = ChatEntryDto.builder()
                .id(1L)
                .chatbotId(1L)
                .sessionId(TEST_SESSION_ID)
                .creator("PLAYER")
                .content("What happens when I land on GO?")
                .createdAt(LocalDateTime.now())
                .build();

        testChatBot = ChatBotDto.builder()
                .id(1L)
                .name("Board Game Rules Assistant")
                .isActive(true)
                .sessionId(TEST_SESSION_ID)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @WithMockUser
    void getChatEntries_ShouldReturnChatEntries() throws Exception {
        // Given
        List<ChatEntryDto> chatEntries = Arrays.asList(testChatEntry);
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(chatEntryService.getChatEntriesBySessionIdAndUser(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(chatEntries);

        // When & Then
        mockMvc.perform(get("/api/sessions/{sessionId}/chatEntries", TEST_SESSION_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].creator").value("PLAYER"))
                .andExpect(jsonPath("$[0].content").value("What happens when I land on GO?"))
                .andExpect(jsonPath("$[0].sessionId").value(TEST_SESSION_ID));

        verify(clerkUserExtractor).extractClerkUserIdRequired(any(Authentication.class));
        verify(chatEntryService).getChatEntriesBySessionIdAndUser(TEST_SESSION_ID, TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void createChatEntry_ShouldCreateAndReturnChatEntry() throws Exception {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent("What happens when I land on GO?");
        request.setCreator("PLAYER");

        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(chatEntryService.createChatEntryForUser(eq(TEST_SESSION_ID), any(CreateChatEntryRequest.class), eq(TEST_USER_ID)))
                .thenReturn(testChatEntry);

        // When & Then
        mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", TEST_SESSION_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.creator").value("PLAYER"))
                .andExpect(jsonPath("$.content").value("What happens when I land on GO?"));

        verify(chatEntryService).createChatEntryForUser(eq(TEST_SESSION_ID), any(CreateChatEntryRequest.class), eq(TEST_USER_ID));
    }

    @Test
    @WithMockUser
    void createChatBot_ShouldCreateAndReturnChatBot() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(chatBotService.createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(testChatBot);

        // When & Then
        mockMvc.perform(post("/api/sessions/{sessionId}/chatbot", TEST_SESSION_ID)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Board Game Rules Assistant"))
                .andExpect(jsonPath("$.isActive").value(true))
                .andExpect(jsonPath("$.sessionId").value(TEST_SESSION_ID));

        verify(chatBotService).createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID);
    }

    @Test
    void getChatEntries_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any()))
                .thenThrow(new IllegalStateException("User not authenticated"));

        // When & Then
        mockMvc.perform(get("/api/sessions/{sessionId}/chatEntries", TEST_SESSION_ID))
                .andExpect(status().isUnauthorized());

        verify(chatEntryService, never()).getChatEntriesBySessionIdAndUser(any(), any());
    }

    @Test
    @WithMockUser
    void getChatEntries_WhenServiceThrowsException_ShouldReturnInternalServerError() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(chatEntryService.getChatEntriesBySessionIdAndUser(TEST_SESSION_ID, TEST_USER_ID))
                .thenThrow(new RuntimeException("Database error"));

        // When & Then
        mockMvc.perform(get("/api/sessions/{sessionId}/chatEntries", TEST_SESSION_ID))
                .andExpect(status().isInternalServerError());

        verify(chatEntryService).getChatEntriesBySessionIdAndUser(TEST_SESSION_ID, TEST_USER_ID);
    }

    @Test
    void createChatEntry_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent("Test message");
        request.setCreator("PLAYER");

        when(clerkUserExtractor.extractClerkUserIdRequired(any()))
                .thenThrow(new IllegalStateException("User not authenticated"));

        // When & Then
        mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", TEST_SESSION_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(chatEntryService, never()).createChatEntryForUser(any(), any(), any());
    }

    @Test
    @WithMockUser
    void createChatEntry_WhenServiceThrowsException_ShouldReturnInternalServerError() throws Exception {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent("Test message");
        request.setCreator("PLAYER");

        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(chatEntryService.createChatEntryForUser(eq(TEST_SESSION_ID), any(CreateChatEntryRequest.class), eq(TEST_USER_ID)))
                .thenThrow(new RuntimeException("Service error"));

        // When & Then
        mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", TEST_SESSION_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isInternalServerError());

        verify(chatEntryService).createChatEntryForUser(eq(TEST_SESSION_ID), any(CreateChatEntryRequest.class), eq(TEST_USER_ID));
    }

    @Test
    void createChatBot_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any()))
                .thenThrow(new IllegalStateException("User not authenticated"));

        // When & Then
        mockMvc.perform(post("/api/sessions/{sessionId}/chatbot", TEST_SESSION_ID)
                        .with(csrf()))
                .andExpect(status().isUnauthorized());

        verify(chatBotService, never()).createOrGetChatBotForSessionAndUser(any(), any());
    }

    @Test
    @WithMockUser
    void createChatBot_WhenServiceThrowsException_ShouldReturnInternalServerError() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(chatBotService.createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID))
                .thenThrow(new RuntimeException("Service error"));

        // When & Then
        mockMvc.perform(post("/api/sessions/{sessionId}/chatbot", TEST_SESSION_ID)
                        .with(csrf()))
                .andExpect(status().isInternalServerError());

        verify(chatBotService).createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void createChatEntry_WithInvalidJson_ShouldReturnBadRequest() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);

        // When & Then
        mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", TEST_SESSION_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid json}")
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        verify(chatEntryService, never()).createChatEntryForUser(any(), any(), any());
    }

    @Test
    @WithMockUser
    void createChatEntry_WithEmptyContent_ShouldStillProcessRequest() throws Exception {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent("");
        request.setCreator("PLAYER");

        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(chatEntryService.createChatEntryForUser(eq(TEST_SESSION_ID), any(CreateChatEntryRequest.class), eq(TEST_USER_ID)))
                .thenReturn(testChatEntry);

        // When & Then
        mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", TEST_SESSION_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(chatEntryService).createChatEntryForUser(eq(TEST_SESSION_ID), any(CreateChatEntryRequest.class), eq(TEST_USER_ID));
    }
}