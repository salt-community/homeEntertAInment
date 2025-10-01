package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatBotDto;
import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatBot;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatBotRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ChatBotService
 */
@ExtendWith(MockitoExtension.class)
class ChatBotServiceTest {

    @Mock
    private ChatBotRepository chatBotRepository;

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private ChatBotService chatBotService;

    private Session testSession;
    private ChatBot testChatBot;
    private final String TEST_USER_ID = "test-user-123";
    private final Long TEST_SESSION_ID = 1L;

    @BeforeEach
    void setUp() {
        testSession = Session.builder()
                .id(TEST_SESSION_ID)
                .gameName("Monopoly")
                .gameState("setup")
                .isActive(true)
                .clerkUserId(TEST_USER_ID)
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
    }

    @Test
    void createOrGetChatBotForSessionAndUser_WhenChatBotExists_ShouldReturnExisting() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testChatBot));

        // When
        ChatBotDto result = chatBotService.createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID);

        // Then
        assertNotNull(result);
        assertEquals(testChatBot.getId(), result.getId());
        assertEquals(testChatBot.getName(), result.getName());
        assertEquals(testChatBot.getIsActive(), result.getIsActive());
        assertEquals(TEST_SESSION_ID, result.getSessionId());
        
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository).findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository, never()).save(any(ChatBot.class));
    }

    @Test
    void createOrGetChatBotForSessionAndUser_WhenChatBotNotExists_ShouldCreateNew() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.empty());
        when(chatBotRepository.save(any(ChatBot.class))).thenReturn(testChatBot);

        // When
        ChatBotDto result = chatBotService.createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID);

        // Then
        assertNotNull(result);
        assertEquals(testChatBot.getId(), result.getId());
        assertEquals("Board Game Rules Assistant", result.getName());
        assertTrue(result.getIsActive());
        assertEquals(TEST_SESSION_ID, result.getSessionId());
        
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository).findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository).save(any(ChatBot.class));
    }

    @Test
    void createOrGetChatBotForSessionAndUser_WhenSessionNotFound_ShouldThrowException() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                chatBotService.createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID));

        assertTrue(exception.getMessage().contains("Session not found"));
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository, never()).findBySession_IdAndClerkUserId(any(), any());
        verify(chatBotRepository, never()).save(any(ChatBot.class));
    }

    @Test
    void getChatBotBySessionIdAndUser_WhenChatBotExists_ShouldReturnChatBot() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testChatBot));

        // When
        Optional<ChatBotDto> result = chatBotService.getChatBotBySessionIdAndUser(TEST_SESSION_ID, TEST_USER_ID);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testChatBot.getId(), result.get().getId());
        assertEquals(testChatBot.getName(), result.get().getName());
        
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository).findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
    }

    @Test
    void getChatBotBySessionIdAndUser_WhenChatBotNotExists_ShouldReturnEmpty() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.empty());

        // When
        Optional<ChatBotDto> result = chatBotService.getChatBotBySessionIdAndUser(TEST_SESSION_ID, TEST_USER_ID);

        // Then
        assertFalse(result.isPresent());
        
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository).findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
    }

    @Test
    void getChatBotBySessionIdAndUser_WhenSessionNotFound_ShouldReturnEmpty() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.empty());

        // When
        Optional<ChatBotDto> result = chatBotService.getChatBotBySessionIdAndUser(TEST_SESSION_ID, TEST_USER_ID);

        // Then
        assertFalse(result.isPresent());
        
        verify(sessionRepository).findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID);
        verify(chatBotRepository, never()).findBySession_IdAndClerkUserId(any(), any());
    }

    @Test
    void createOrGetChatBotForSessionAndUser_WhenRepositoryThrowsException_ShouldWrapException() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.empty());
        when(chatBotRepository.save(any(ChatBot.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                chatBotService.createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID));

        assertTrue(exception.getMessage().contains("Failed to create or get chatbot"));
        verify(chatBotRepository).save(any(ChatBot.class));
    }

    @Test
    void createOrGetChatBotForSessionAndUser_ShouldSetCorrectChatBotProperties() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.of(testSession));
        when(chatBotRepository.findBySession_IdAndClerkUserId(TEST_SESSION_ID, TEST_USER_ID))
                .thenReturn(Optional.empty());
        when(chatBotRepository.save(any(ChatBot.class))).thenAnswer(invocation -> {
            ChatBot chatBot = invocation.getArgument(0);
            chatBot.setId(1L);
            return chatBot;
        });

        // When
        ChatBotDto result = chatBotService.createOrGetChatBotForSessionAndUser(TEST_SESSION_ID, TEST_USER_ID);

        // Then
        assertNotNull(result);
        assertEquals("Board Game Rules Assistant", result.getName());
        assertTrue(result.getIsActive());
        assertEquals(TEST_SESSION_ID, result.getSessionId());
        
        verify(chatBotRepository).save(argThat(chatBot -> 
            "Board Game Rules Assistant".equals(chatBot.getName()) &&
            Boolean.TRUE.equals(chatBot.getIsActive()) &&
            testSession.equals(chatBot.getSession()) &&
            TEST_USER_ID.equals(chatBot.getClerkUserId())
        ));
    }
}