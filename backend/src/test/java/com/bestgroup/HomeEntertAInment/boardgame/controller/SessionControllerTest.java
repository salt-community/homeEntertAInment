package com.bestgroup.HomeEntertAInment.boardgame.controller;

import com.bestgroup.HomeEntertAInment.boardgame.entity.RuleSet;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.service.ConvertApiService;
import com.bestgroup.HomeEntertAInment.boardgame.service.RuleSetService;
import com.bestgroup.HomeEntertAInment.boardgame.service.SessionService;
import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for SessionController
 */
@WebMvcTest(SessionController.class)
@TestPropertySource(properties = {
    "CONVERT_API_TOKEN=test-token",
    "GEMINI_API_KEY=test-key",
    "spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/auth/realms/test"
})
@ActiveProfiles("test")
class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private RuleSetService ruleSetService;

    @MockBean
    private ConvertApiService convertApiService;

    @MockBean
    private ClerkUserExtractor clerkUserExtractor;

    @Autowired
    private ObjectMapper objectMapper;

    private Session testSession;
    private final String TEST_USER_ID = "test-user-123";
    private final String TEST_GAME_NAME = "Monopoly";

    @BeforeEach
    void setUp() {
        testSession = Session.builder()
                .id(1L)
                .gameName(TEST_GAME_NAME)
                .gameState("setup")
                .isActive(true)
                .clerkUserId(TEST_USER_ID)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @WithMockUser
    void getAllSessions_ShouldReturnUserSessions() throws Exception {
        // Given
        List<Session> sessions = Arrays.asList(testSession);
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(sessionService.getAllSessionsForUser(TEST_USER_ID)).thenReturn(sessions);

        // When & Then
        mockMvc.perform(get("/api/boardgame/sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].gameName").value(TEST_GAME_NAME))
                .andExpect(jsonPath("$[0].gameState").value("setup"))
                .andExpect(jsonPath("$[0].isActive").value(true));

        verify(clerkUserExtractor).extractClerkUserIdRequired(any(Authentication.class));
        verify(sessionService).getAllSessionsForUser(TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void getActiveSessions_ShouldReturnActiveUserSessions() throws Exception {
        // Given
        List<Session> sessions = Arrays.asList(testSession);
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(sessionService.getActiveSessionsForUser(TEST_USER_ID)).thenReturn(sessions);

        // When & Then
        mockMvc.perform(get("/api/boardgame/sessions/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].isActive").value(true));

        verify(sessionService).getActiveSessionsForUser(TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void createSession_ShouldCreateAndReturnSession() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(sessionService.createSessionForUser(TEST_GAME_NAME, TEST_USER_ID))
                .thenReturn(testSession);

        // When & Then
        mockMvc.perform(post("/api/boardgame/sessions")
                        .param("gameName", TEST_GAME_NAME)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.gameName").value(TEST_GAME_NAME))
                .andExpect(jsonPath("$.gameState").value("setup"));

        verify(sessionService).createSessionForUser(TEST_GAME_NAME, TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void getSessionById_WhenSessionExists_ShouldReturnSession() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(sessionService.getSessionByNumericIdAndUser(1L, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));

        // When & Then
        mockMvc.perform(get("/api/boardgame/sessions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.gameName").value(TEST_GAME_NAME));

        verify(sessionService).getSessionByNumericIdAndUser(1L, TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void getSessionById_WhenSessionNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(sessionService.getSessionByNumericIdAndUser(1L, TEST_USER_ID))
                .thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/boardgame/sessions/1"))
                .andExpect(status().isNotFound());

        verify(sessionService).getSessionByNumericIdAndUser(1L, TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void deactivateSession_WhenSessionExists_ShouldReturnOk() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(sessionService.deactivateSessionForUser(1L, TEST_USER_ID)).thenReturn(true);

        // When & Then
        mockMvc.perform(delete("/api/boardgame/sessions/1")
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(sessionService).deactivateSessionForUser(1L, TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void deactivateSession_WhenSessionNotExists_ShouldReturnNotFound() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(sessionService.deactivateSessionForUser(1L, TEST_USER_ID)).thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/boardgame/sessions/1")
                        .with(csrf()))
                .andExpect(status().isNotFound());

        verify(sessionService).deactivateSessionForUser(1L, TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void createSessionWithRules_WithTextRules_ShouldCreateSession() throws Exception {
        // Given
        String playerNames = "Alice,Bob,Charlie";
        String ruleText = "Game rules: Roll dice to move...";
        
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        RuleSet mockRuleSet = RuleSet.builder()
                .id(1L)
                .fileName("test-rules.txt")
                .decodedData(ruleText)
                .clerkUserId(TEST_USER_ID)
                .build();
        when(ruleSetService.createRuleSetFromTextForUser(eq(TEST_GAME_NAME), eq(ruleText), eq(TEST_USER_ID)))
                .thenReturn(mockRuleSet);
        when(sessionService.createSessionForUser(TEST_GAME_NAME, TEST_USER_ID))
                .thenReturn(testSession);
        when(sessionService.saveSession(any(Session.class))).thenReturn(testSession);

        // When & Then
        mockMvc.perform(multipart("/api/boardgame/sessions/create-with-rules")
                        .param("gameName", TEST_GAME_NAME)
                        .param("playerNames", playerNames)
                        .param("ruleText", ruleText)
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(ruleSetService).createRuleSetFromTextForUser(TEST_GAME_NAME, ruleText, TEST_USER_ID);
        verify(sessionService).createSessionForUser(TEST_GAME_NAME, TEST_USER_ID);
        verify(sessionService).saveSession(any(Session.class));
    }

    @Test
    @WithMockUser
    void createSessionWithRules_WithPdfFile_ShouldCreateSession() throws Exception {
        // Given
        String playerNames = "Alice,Bob";
        MockMultipartFile pdfFile = new MockMultipartFile(
                "ruleFile", 
                "rules.pdf", 
                "application/pdf", 
                "PDF content".getBytes()
        );
        
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        RuleSet mockRuleSet = RuleSet.builder()
                .id(1L)
                .fileName("rules.pdf")
                .decodedData("PDF rules content")
                .clerkUserId(TEST_USER_ID)
                .build();
        when(convertApiService.convertPdfToText(any())).thenReturn(null); // Simplified
        when(ruleSetService.createRuleSetForUser(any(), eq(TEST_USER_ID))).thenReturn(mockRuleSet);
        when(sessionService.createSessionForUser(TEST_GAME_NAME, TEST_USER_ID))
                .thenReturn(testSession);
        when(sessionService.saveSession(any(Session.class))).thenReturn(testSession);

        // When & Then
        mockMvc.perform(multipart("/api/boardgame/sessions/create-with-rules")
                        .file(pdfFile)
                        .param("gameName", TEST_GAME_NAME)
                        .param("playerNames", playerNames)
                        .with(csrf()))
                .andExpect(status().isOk());

        verify(convertApiService).convertPdfToText(any());
        verify(sessionService).createSessionForUser(TEST_GAME_NAME, TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void createSessionWithRules_WithBothFileAndText_ShouldReturnBadRequest() throws Exception {
        // Given
        String playerNames = "Alice,Bob";
        String ruleText = "Game rules text";
        MockMultipartFile pdfFile = new MockMultipartFile(
                "ruleFile", 
                "rules.pdf", 
                "application/pdf", 
                "PDF content".getBytes()
        );
        
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);

        // When & Then
        mockMvc.perform(multipart("/api/boardgame/sessions/create-with-rules")
                        .file(pdfFile)
                        .param("gameName", TEST_GAME_NAME)
                        .param("playerNames", playerNames)
                        .param("ruleText", ruleText)
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        verify(sessionService, never()).createSessionForUser(any(), any());
    }

    @Test
    @WithMockUser
    void createSessionWithRules_WithNeitherFileNorText_ShouldReturnBadRequest() throws Exception {
        // Given
        String playerNames = "Alice,Bob";
        
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);

        // When & Then
        mockMvc.perform(multipart("/api/boardgame/sessions/create-with-rules")
                        .param("gameName", TEST_GAME_NAME)
                        .param("playerNames", playerNames)
                        .with(csrf()))
                .andExpect(status().isBadRequest());

        verify(sessionService, never()).createSessionForUser(any(), any());
    }

    @Test
    void getAllSessions_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any()))
                .thenThrow(new IllegalStateException("User not authenticated"));

        // When & Then
        mockMvc.perform(get("/api/boardgame/sessions"))
                .andExpect(status().isUnauthorized());

        verify(sessionService, never()).getAllSessionsForUser(any());
    }

    @Test
    @WithMockUser
    void getAllSessions_WhenServiceThrowsException_ShouldReturnInternalServerError() throws Exception {
        // Given
        when(clerkUserExtractor.extractClerkUserIdRequired(any(Authentication.class)))
                .thenReturn(TEST_USER_ID);
        when(sessionService.getAllSessionsForUser(TEST_USER_ID))
                .thenThrow(new RuntimeException("Database error"));

        // When & Then
        mockMvc.perform(get("/api/boardgame/sessions"))
                .andExpect(status().isInternalServerError());

        verify(sessionService).getAllSessionsForUser(TEST_USER_ID);
    }
}