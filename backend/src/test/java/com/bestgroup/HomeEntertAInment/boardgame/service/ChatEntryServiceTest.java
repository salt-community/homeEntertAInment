package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatEntryDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.CreateChatEntryRequest;
import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatBot;
import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatEntry;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Player;
import com.bestgroup.HomeEntertAInment.boardgame.entity.RuleSet;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatBotRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatEntryRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import com.bestgroup.HomeEntertAInment.service.GeminiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ChatEntryService
 */
@ExtendWith(MockitoExtension.class)
class ChatEntryServiceTest {

    @Mock
    private ChatEntryRepository chatEntryRepository;

    @Mock
    private ChatBotRepository chatBotRepository;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private GeminiService geminiService;

    @InjectMocks
    private ChatEntryService chatEntryService;

    private Session testSession;
    private ChatBot testChatBot;
    private ChatEntry testChatEntry;
    private RuleSet testRuleSet;
    private final String TEST_USER_ID = "test-user-123";
    private final Long TEST_SESSION_ID = 1L;
    private final String TEST_MESSAGE = "What happens when I land on GO?";

    @BeforeEach
    void setUp() {
        testRuleSet = RuleSet.builder()
                .id(1L)
                .fileName("monopoly-rules.pdf")
                .decodedData("Monopoly rules: When you land on GO, collect $200...")
                .clerkUserId(TEST_USER_ID)
                .build();

        Player player1 = Player.builder()
                .id(1L)
                .playerName("Alice")
                .build();

        Player player2 = Player.builder()
                .id(2L)
                .playerName("Bob")
                .build();

        testSession = Session.builder()
                .id(TEST_SESSION_ID)
                .gameName("Monopoly")
                .gameState("playing")
                .isActive(true)
                .clerkUserId(TEST_USER_ID)
                .ruleSet(testRuleSet)
                .players(Arrays.asList(player1, player2))
                .createdAt(LocalDateTime.now())
                .build();

        testChatBot = ChatBot.builder()
                .id(1L)
                .name("Board Game Rules Assistant")
                .isActive(true)
                .session(testSession)
                .clerkUserId(TEST_USER_ID)
                .createdAt(LocalDateTime.now())
                .build();

        testChatEntry = ChatEntry.builder()
                .id(1L)
                .content(TEST_MESSAGE)
                .creator("PLAYER")
                .chatBot(testChatBot)
                .session(testSession)
                .clerkUserId(TEST_USER_ID)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getChatEntriesBySessionIdAndUser_ShouldReturnChatEntries() {
        // Given
        List<ChatEntry> expectedEntries = Arrays.asList(testChatEntry);
        when(chatEntryRepository.findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(expectedEntries);

        // When
        List<ChatEntryDto> result = chatEntryService.getChatEntriesBySessionIdAndUser(TEST_SESSION_ID, TEST_USER_ID);

        // Then
        assertEquals(1, result.size());
        ChatEntryDto dto = result.get(0);
        assertEquals(testChatEntry.getId(), dto.getId());
        assertEquals(testChatEntry.getContent(), dto.getContent());
        assertEquals(testChatEntry.getCreator(), dto.getCreator());
        assertEquals(testChatEntry.getChatBot().getId(), dto.getChatbotId());
        assertEquals(testChatEntry.getSession().getId(), dto.getSessionId());
        
        verify(chatEntryRepository).findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(TEST_SESSION_ID, TEST_USER_ID);
    }

    @Test
    void createChatEntryForUser_WithPlayerMessage_ShouldCreateEntryAndTriggerAI() {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent(TEST_MESSAGE);
        request.setCreator("PLAYER");

        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testChatBot));
        when(chatEntryRepository.save(any(ChatEntry.class))).thenReturn(testChatEntry);
        when(chatEntryRepository.findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Arrays.asList());
        when(geminiService.generateGameRuleResponse(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("When you land on GO, you collect $200.");

        // When
        ChatEntryDto result = chatEntryService.createChatEntryForUser(TEST_SESSION_ID, request, TEST_USER_ID);

        // Then
        assertNotNull(result);
        assertEquals(testChatEntry.getId(), result.getId());
        assertEquals(testChatEntry.getContent(), result.getContent());
        assertEquals("PLAYER", result.getCreator());
        
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository).findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatEntryRepository, times(2)).save(any(ChatEntry.class)); // Once for player, once for AI
        verify(geminiService).generateGameRuleResponse(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    void createChatEntryForUser_WithAIMessage_ShouldNotTriggerAI() {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent("AI response message");
        request.setCreator("AI");

        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testChatBot));
        when(chatEntryRepository.save(any(ChatEntry.class))).thenReturn(testChatEntry);

        // When
        ChatEntryDto result = chatEntryService.createChatEntryForUser(TEST_SESSION_ID, request, TEST_USER_ID);

        // Then
        assertNotNull(result);
        verify(chatEntryRepository, times(1)).save(any(ChatEntry.class)); // Only once for AI message
        verify(geminiService, never()).generateGameRuleResponse(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    void createChatEntryForUser_WhenSessionNotFound_ShouldThrowException() {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent(TEST_MESSAGE);
        request.setCreator("PLAYER");

        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                chatEntryService.createChatEntryForUser(TEST_SESSION_ID, request, TEST_USER_ID));

        assertTrue(exception.getMessage().contains("Session not found"));
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository, never()).findBySession_IdAndClerkUserId(any(), any());
        verify(chatEntryRepository, never()).save(any(ChatEntry.class));
    }

    @Test
    void createChatEntryForUser_WhenChatBotNotFound_ShouldThrowException() {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent(TEST_MESSAGE);
        request.setCreator("PLAYER");

        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                chatEntryService.createChatEntryForUser(TEST_SESSION_ID, request, TEST_USER_ID));

        assertTrue(exception.getMessage().contains("ChatBot not found"));
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository).findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatEntryRepository, never()).save(any(ChatEntry.class));
    }

    @Test
    void createChatEntryForUser_WhenGeminiServiceFails_ShouldCreateFallbackResponse() {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent(TEST_MESSAGE);
        request.setCreator("PLAYER");

        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testChatBot));
        when(chatEntryRepository.save(any(ChatEntry.class))).thenReturn(testChatEntry);
        when(chatEntryRepository.findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Arrays.asList());
        when(geminiService.generateGameRuleResponse(anyString(), anyString(), anyString(), anyString()))
                .thenThrow(new RuntimeException("Gemini API error"));

        // When
        ChatEntryDto result = chatEntryService.createChatEntryForUser(TEST_SESSION_ID, request, TEST_USER_ID);

        // Then
        assertNotNull(result);
        verify(chatEntryRepository, times(2)).save(any(ChatEntry.class)); // Player message + fallback AI response
        verify(geminiService).generateGameRuleResponse(anyString(), anyString(), anyString(), anyString());
        
        // Verify fallback message was created
        verify(chatEntryRepository).save(argThat(entry -> 
            "AI".equals(entry.getCreator()) && 
            entry.getContent().contains("AI agent is not working right now")
        ));
    }

    @Test
    void createChatEntryForUser_ShouldIncludeCorrectContextInAIRequest() {
        // Given
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent(TEST_MESSAGE);
        request.setCreator("PLAYER");

        ChatEntry previousEntry = ChatEntry.builder()
                .content("Previous question")
                .creator("PLAYER")
                .build();

        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testChatBot));
        when(chatEntryRepository.save(any(ChatEntry.class))).thenReturn(testChatEntry);
        when(chatEntryRepository.findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Arrays.asList(previousEntry));
        when(geminiService.generateGameRuleResponse(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("AI response");

        // When
        chatEntryService.createChatEntryForUser(TEST_SESSION_ID, request, TEST_USER_ID);

        // Then
        verify(geminiService).generateGameRuleResponse(
                eq("PLAYER: Previous question"), // Chat history
                eq(TEST_MESSAGE), // User question
                eq("Alice, Bob"), // Players list
                eq("Monopoly rules: When you land on GO, collect $200...") // Rule set data
        );
    }

    @Test
    void createChatEntryForUser_WithNoRuleSet_ShouldUseDefaultMessage() {
        // Given
        testSession.setRuleSet(null);
        CreateChatEntryRequest request = new CreateChatEntryRequest();
        request.setContent(TEST_MESSAGE);
        request.setCreator("PLAYER");

        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testChatBot));
        when(chatEntryRepository.save(any(ChatEntry.class))).thenReturn(testChatEntry);
        when(chatEntryRepository.findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Arrays.asList());
        when(geminiService.generateGameRuleResponse(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("AI response");

        // When
        chatEntryService.createChatEntryForUser(TEST_SESSION_ID, request, TEST_USER_ID);

        // Then
        verify(geminiService).generateGameRuleResponse(
                anyString(), // Chat history
                eq(TEST_MESSAGE), // User question
                eq("Alice, Bob"), // Players list
                eq("No rules available") // Default rule set message
        );
    }
}