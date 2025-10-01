package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SessionService
 */
@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private SessionService sessionService;

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
    void getAllSessionsForUser_ShouldReturnUserSessions() {
        // Given
        List<Session> expectedSessions = Arrays.asList(testSession);
        when(sessionRepository.findByClerkUserId(TEST_USER_ID)).thenReturn(expectedSessions);

        // When
        List<Session> result = sessionService.getAllSessionsForUser(TEST_USER_ID);

        // Then
        assertEquals(1, result.size());
        assertEquals(testSession, result.get(0));
        verify(sessionRepository).findByClerkUserId(TEST_USER_ID);
    }

    @Test
    void getActiveSessionsForUser_ShouldReturnActiveUserSessions() {
        // Given
        List<Session> expectedSessions = Arrays.asList(testSession);
        when(sessionRepository.findByClerkUserIdAndIsActiveTrue(TEST_USER_ID)).thenReturn(expectedSessions);

        // When
        List<Session> result = sessionService.getActiveSessionsForUser(TEST_USER_ID);

        // Then
        assertEquals(1, result.size());
        assertEquals(testSession, result.get(0));
        verify(sessionRepository).findByClerkUserIdAndIsActiveTrue(TEST_USER_ID);
    }

    @Test
    void getSessionByNumericIdAndUser_WhenSessionExists_ShouldReturnSession() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(1L, TEST_USER_ID)).thenReturn(Optional.of(testSession));

        // When
        Optional<Session> result = sessionService.getSessionByNumericIdAndUser(1L, TEST_USER_ID);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testSession, result.get());
        verify(sessionRepository).findByIdAndClerkUserId(1L, TEST_USER_ID);
    }

    @Test
    void getSessionByNumericIdAndUser_WhenSessionNotExists_ShouldReturnEmpty() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(1L, TEST_USER_ID)).thenReturn(Optional.empty());

        // When
        Optional<Session> result = sessionService.getSessionByNumericIdAndUser(1L, TEST_USER_ID);

        // Then
        assertFalse(result.isPresent());
        verify(sessionRepository).findByIdAndClerkUserId(1L, TEST_USER_ID);
    }

    @Test
    void createSessionForUser_ShouldCreateAndReturnSession() {
        // Given
        Session expectedSession = Session.builder()
                .gameName(TEST_GAME_NAME)
                .gameState("setup")
                .isActive(true)
                .clerkUserId(TEST_USER_ID)
                .build();
        
        when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

        // When
        Session result = sessionService.createSessionForUser(TEST_GAME_NAME, TEST_USER_ID);

        // Then
        assertNotNull(result);
        assertEquals(testSession, result);
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void updateSessionForUser_WhenSessionExists_ShouldUpdateAndReturnSession() {
        // Given
        String newGameState = "playing";
        Session updatedSession = Session.builder()
                .id(1L)
                .gameName(TEST_GAME_NAME)
                .gameState(newGameState)
                .isActive(true)
                .clerkUserId(TEST_USER_ID)
                .build();

        when(sessionRepository.findByIdAndClerkUserId(1L, TEST_USER_ID)).thenReturn(Optional.of(testSession));
        when(sessionRepository.save(any(Session.class))).thenReturn(updatedSession);

        // When
        Optional<Session> result = sessionService.updateSessionForUser(1L, newGameState, TEST_USER_ID);

        // Then
        assertTrue(result.isPresent());
        assertEquals(newGameState, result.get().getGameState());
        verify(sessionRepository).findByIdAndClerkUserId(1L, TEST_USER_ID);
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void updateSessionForUser_WhenSessionNotExists_ShouldReturnEmpty() {
        // Given
        String newGameState = "playing";
        when(sessionRepository.findByIdAndClerkUserId(1L, TEST_USER_ID)).thenReturn(Optional.empty());

        // When
        Optional<Session> result = sessionService.updateSessionForUser(1L, newGameState, TEST_USER_ID);

        // Then
        assertFalse(result.isPresent());
        verify(sessionRepository).findByIdAndClerkUserId(1L, TEST_USER_ID);
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void deactivateSessionForUser_WhenSessionExists_ShouldDeactivateAndReturnTrue() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(1L, TEST_USER_ID)).thenReturn(Optional.of(testSession));
        when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

        // When
        boolean result = sessionService.deactivateSessionForUser(1L, TEST_USER_ID);

        // Then
        assertTrue(result);
        verify(sessionRepository).findByIdAndClerkUserId(1L, TEST_USER_ID);
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void deactivateSessionForUser_WhenSessionNotExists_ShouldReturnFalse() {
        // Given
        when(sessionRepository.findByIdAndClerkUserId(1L, TEST_USER_ID)).thenReturn(Optional.empty());

        // When
        boolean result = sessionService.deactivateSessionForUser(1L, TEST_USER_ID);

        // Then
        assertFalse(result);
        verify(sessionRepository).findByIdAndClerkUserId(1L, TEST_USER_ID);
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void saveSession_ShouldSaveAndReturnSession() {
        // Given
        when(sessionRepository.save(testSession)).thenReturn(testSession);

        // When
        Session result = sessionService.saveSession(testSession);

        // Then
        assertEquals(testSession, result);
        verify(sessionRepository).save(testSession);
    }

    @Test
    void createSessionForUser_WithNullGameName_ShouldHandleGracefully() {
        // Given
        when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

        // When
        Session result = sessionService.createSessionForUser(null, TEST_USER_ID);

        // Then
        assertNotNull(result);
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void createSessionForUser_WithEmptyGameName_ShouldHandleGracefully() {
        // Given
        when(sessionRepository.save(any(Session.class))).thenReturn(testSession);

        // When
        Session result = sessionService.createSessionForUser("", TEST_USER_ID);

        // Then
        assertNotNull(result);
        verify(sessionRepository).save(any(Session.class));
    }
}