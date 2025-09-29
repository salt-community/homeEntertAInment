package com.bestgroup.HomeEntertAInment.boardgame.controller;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatBotDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatEntryDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.CreateChatEntryRequest;
import com.bestgroup.HomeEntertAInment.boardgame.service.ChatBotService;
import com.bestgroup.HomeEntertAInment.boardgame.service.ChatEntryService;
import com.bestgroup.HomeEntertAInment.config.ClerkUserExtractor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for chat functionality
 */
@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class ChatController {

    private final ChatEntryService chatEntryService;
    private final ChatBotService chatBotService;
    private final ClerkUserExtractor clerkUserExtractor;

    /**
     * Get all chat entries for a session and user
     * GET /api/sessions/{sessionId}/chatEntries
     */
    @GetMapping("/{sessionId}/chatEntries")
    public ResponseEntity<List<ChatEntryDto>> getChatEntries(@PathVariable Long sessionId, Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Getting chat entries for session: {} and user: {}", sessionId, clerkUserId);
            List<ChatEntryDto> entries = chatEntryService.getChatEntriesBySessionIdAndUser(sessionId, clerkUserId);
            return ResponseEntity.ok(entries);
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        } catch (Exception e) {
            log.error("Error retrieving chat entries for session {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create a new chat entry for a session and user
     * POST /api/sessions/{sessionId}/chatEntry
     */
    @PostMapping("/{sessionId}/chatEntry")
    public ResponseEntity<ChatEntryDto> createChatEntry(
            @PathVariable Long sessionId,
            @RequestBody CreateChatEntryRequest request,
            Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Creating chat entry for session: {} and user: {}", sessionId, clerkUserId);
            ChatEntryDto entry = chatEntryService.createChatEntryForUser(sessionId, request, clerkUserId);
            return ResponseEntity.ok(entry);
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        } catch (Exception e) {
            log.error("Error creating chat entry for session {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Create or get chatbot for a session and user
     * POST /api/sessions/{sessionId}/chatbot
     */
    @PostMapping("/{sessionId}/chatbot")
    public ResponseEntity<ChatBotDto> createChatBot(@PathVariable Long sessionId, Authentication authentication) {
        try {
            String clerkUserId = clerkUserExtractor.extractClerkUserIdRequired(authentication);
            log.info("Creating or getting chatbot for session: {} and user: {}", sessionId, clerkUserId);
            ChatBotDto chatbot = chatBotService.createOrGetChatBotForSessionAndUser(sessionId, clerkUserId);
            return ResponseEntity.ok(chatbot);
        } catch (IllegalStateException e) {
            log.error("Authentication error: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        } catch (Exception e) {
            log.error("Error creating/getting chatbot for session {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
