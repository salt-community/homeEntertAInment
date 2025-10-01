package com.bestgroup.HomeEntertAInment.boardgame.integration;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatBotDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatEntryDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.CreateChatEntryRequest;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatBotRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatEntryRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import com.bestgroup.HomeEntertAInment.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for Board Game Rule Inspector functionality
 */
@SpringBootTest
@AutoConfigureWebMvc
@TestPropertySource(properties = {
    "CONVERT_API_TOKEN=test-token",
    "GEMINI_API_KEY=test-key",
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@Transactional
class BoardGameIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ChatBotRepository chatBotRepository;

    @Autowired
    private ChatEntryRepository chatEntryRepository;

    @MockBean
    private ClerkUserExtractor clerkUserExtractor;

    @MockBean
    private GeminiService geminiService;

    @Autowired
    private ObjectMapper objectMapper;

    private final String TEST_USER_ID = "test-user-123";
    private final String TEST_GAME_NAME = "Monopoly";

    @BeforeEach
    void setUp() {
        // Clean up repositories
        chatEntryRepository.deleteAll();
        chatBotRepository.deleteAll();
        sessionRepository.deleteAll();
        
        // Mock user extraction
        when(clerkUserExtractor.extractClerkUserIdRequired(any()))
                .thenReturn(TEST_USER_ID);
    }

    @Test
    @WithMockUser
    void completeWorkflow_CreateSessionAndChatFlow() throws Exception {
        // Step 1: Create a session
        String createSessionResponse = mockMvc.perform(post("/api/boardgame/sessions")
                        .param("gameName", TEST_GAME_NAME)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameName").value(TEST_GAME_NAME))
                .andExpect(jsonPath("$.gameState").value("setup"))
                .andExpect(jsonPath("$.isActive").value(true))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Session createdSession = objectMapper.readValue(createSessionResponse, Session.class);
        Long sessionId = createdSession.getId();

        // Verify session was created in database
        assertTrue(sessionRepository.findById(sessionId).isPresent());

        // Step 2: Create a chatbot for the session
        String createChatBotResponse = mockMvc.perform(post("/api/sessions/{sessionId}/chatbot", sessionId)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Board Game Rules Assistant"))
                .andExpect(jsonPath("$.isActive").value(true))
                .andExpect(jsonPath("$.sessionId").value(sessionId))
                .andReturn()
                .getResponse()
                .getContentAsString();

        ChatBotDto createdChatBot = objectMapper.readValue(createChatBotResponse, ChatBotDto.class);

        // Verify chatbot was created in database
        assertTrue(chatBotRepository.findById(createdChatBot.getId()).isPresent());

        // Step 3: Send a player message
        CreateChatEntryRequest playerMessage = new CreateChatEntryRequest();
        playerMessage.setContent("What happens when I land on GO?");
        playerMessage.setCreator("PLAYER");

        // Mock Gemini response
        when(geminiService.generateGameRuleResponse(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("When you land on GO, you collect $200.");

        String createChatEntryResponse = mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", sessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(playerMessage))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.creator").value("PLAYER"))
                .andExpect(jsonPath("$.content").value("What happens when I land on GO?"))
                .andExpect(jsonPath("$.sessionId").value(sessionId))
                .andReturn()
                .getResponse()
                .getContentAsString();

        ChatEntryDto createdChatEntry = objectMapper.readValue(createChatEntryResponse, ChatEntryDto.class);

        // Step 4: Retrieve chat entries (should include both player message and AI response)
        mockMvc.perform(get("/api/sessions/{sessionId}/chatEntries", sessionId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2)) // Player message + AI response
                .andExpect(jsonPath("$[0].creator").value("PLAYER"))
                .andExpect(jsonPath("$[0].content").value("What happens when I land on GO?"))
                .andExpected(jsonPath("$[1].creator").value("AI"))
                .andExpect(jsonPath("$[1].content").value("When you land on GO, you collect $200."));

        // Step 5: Verify all data persisted correctly
        assertEquals(1, sessionRepository.count());
        assertEquals(1, chatBotRepository.count());
        assertEquals(2, chatEntryRepository.count()); // Player + AI messages

        // Step 6: Deactivate the session
        mockMvc.perform(delete("/api/boardgame/sessions/{sessionId}", sessionId)
                        .with(csrf()))
                .andExpect(status().isOk());

        // Verify session is deactivated but not deleted
        Session deactivatedSession = sessionRepository.findById(sessionId).orElse(null);
        assertNotNull(deactivatedSession);
        assertFalse(deactivatedSession.getIsActive());
    }

    @Test
    @WithMockUser
    void multipleSessionsWorkflow_ShouldIsolateData() throws Exception {
        // Create first session
        String session1Response = mockMvc.perform(post("/api/boardgame/sessions")
                        .param("gameName", "Monopoly")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Session session1 = objectMapper.readValue(session1Response, Session.class);

        // Create second session
        String session2Response = mockMvc.perform(post("/api/boardgame/sessions")
                        .param("gameName", "Scrabble")
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Session session2 = objectMapper.readValue(session2Response, Session.class);

        // Create chatbots for both sessions
        mockMvc.perform(post("/api/sessions/{sessionId}/chatbot", session1.getId())
                        .with(csrf()))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/sessions/{sessionId}/chatbot", session2.getId())
                        .with(csrf()))
                .andExpect(status().isOk());

        // Send messages to both sessions
        CreateChatEntryRequest message1 = new CreateChatEntryRequest();
        message1.setContent("Monopoly question");
        message1.setCreator("PLAYER");

        CreateChatEntryRequest message2 = new CreateChatEntryRequest();
        message2.setContent("Scrabble question");
        message2.setCreator("PLAYER");

        when(geminiService.generateGameRuleResponse(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("AI response");

        mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", session1.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(message1))
                        .with(csrf()))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", session2.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(message2))
                        .with(csrf()))
                .andExpect(status().isOk());

        // Verify session 1 chat entries
        mockMvc.perform(get("/api/sessions/{sessionId}/chatEntries", session1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].content").value("Monopoly question"));

        // Verify session 2 chat entries
        mockMvc.perform(get("/api/sessions/{sessionId}/chatEntries", session2.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].content").value("Scrabble question"));

        // Verify total counts
        assertEquals(2, sessionRepository.count());
        assertEquals(2, chatBotRepository.count());
        assertEquals(4, chatEntryRepository.count()); // 2 sessions × 2 messages each
    }

    @Test
    @WithMockUser
    void sessionManagement_GetAllAndActiveSessionsWorkflow() throws Exception {
        // Create multiple sessions
        mockMvc.perform(post("/api/boardgame/sessions")
                        .param("gameName", "Monopoly")
                        .with(csrf()))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/boardgame/sessions")
                        .param("gameName", "Scrabble")
                        .with(csrf()))
                .andExpect(status().isOk());

        // Get all sessions
        mockMvc.perform(get("/api/boardgame/sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].isActive").value(true))
                .andExpect(jsonPath("$[1].isActive").value(true));

        // Get active sessions
        mockMvc.perform(get("/api/boardgame/sessions/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        // Deactivate one session
        mockMvc.perform(delete("/api/boardgame/sessions/1")
                        .with(csrf()))
                .andExpect(status().isOk());

        // Get active sessions again (should be 1 now)
        mockMvc.perform(get("/api/boardgame/sessions/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        // Get all sessions (should still be 2)
        mockMvc.perform(get("/api/boardgame/sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @WithMockUser
    void errorHandling_NonExistentSession() throws Exception {
        // Try to get non-existent session
        mockMvc.perform(get("/api/boardgame/sessions/999"))
                .andExpect(status().isNotFound());

        // Try to create chatbot for non-existent session
        mockMvc.perform(post("/api/sessions/999/chatbot")
                        .with(csrf()))
                .andExpect(status().isInternalServerError());

        // Try to get chat entries for non-existent session
        mockMvc.perform(get("/api/sessions/999/chatEntries"))
                .andExpect(status().isInternalServerError());

        // Try to deactivate non-existent session
        mockMvc.perform(delete("/api/boardgame/sessions/999")
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void geminiServiceFailure_ShouldCreateFallbackResponse() throws Exception {
        // Create session and chatbot
        String sessionResponse = mockMvc.perform(post("/api/boardgame/sessions")
                        .param("gameName", TEST_GAME_NAME)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Session session = objectMapper.readValue(sessionResponse, Session.class);

        mockMvc.perform(post("/api/sessions/{sessionId}/chatbot", session.getId())
                        .with(csrf()))
                .andExpect(status().isOk());

        // Mock Gemini service failure
        when(geminiService.generateGameRuleResponse(anyString(), anyString(), anyString(), anyString()))
                .thenThrow(new RuntimeException("Gemini API error"));

        // Send player message
        CreateChatEntryRequest message = new CreateChatEntryRequest();
        message.setContent("Test question");
        message.setCreator("PLAYER");

        mockMvc.perform(post("/api/sessions/{sessionId}/chatEntry", session.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(message))
                        .with(csrf()))
                .andExpect(status().isOk());

        // Verify fallback response was created
        mockMvc.perform(get("/api/sessions/{sessionId}/chatEntries", session.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].creator").value("AI"))
                .andExpect(jsonPath("$[1].content").value(org.hamcrest.Matchers.containsString("AI agent is not working right now")));
    }
}