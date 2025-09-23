package com.bestgroup.HomeEntertAInment.boardgame.controller;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatBotDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatEntryDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.CreateChatEntryRequest;
import com.bestgroup.HomeEntertAInment.boardgame.service.ChatBotService;
import com.bestgroup.HomeEntertAInment.boardgame.service.ChatEntryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

    /**
     * Get all chat entries for a session
     * GET /api/sessions/{sessionId}/chatEntries
     */
    @GetMapping("/{sessionId}/chatEntries")
    public ResponseEntity<List<ChatEntryDto>> getChatEntries(@PathVariable Long sessionId) {
        log.info("Getting chat entries for session: {}", sessionId);
        List<ChatEntryDto> entries = chatEntryService.getChatEntriesBySessionId(sessionId);
        return ResponseEntity.ok(entries);
    }

    /**
     * Create a new chat entry
     * POST /api/sessions/{sessionId}/chatEntry
     */
    @PostMapping("/{sessionId}/chatEntry")
    public ResponseEntity<ChatEntryDto> createChatEntry(
            @PathVariable Long sessionId,
            @RequestBody CreateChatEntryRequest request) {
        log.info("Creating chat entry for session: {}", sessionId);
        ChatEntryDto entry = chatEntryService.createChatEntry(sessionId, request);
        return ResponseEntity.ok(entry);
    }

    /**
     * Create or get chatbot for a session
     * POST /api/sessions/{sessionId}/chatbot
     */
    @PostMapping("/{sessionId}/chatbot")
    public ResponseEntity<ChatBotDto> createChatBot(@PathVariable Long sessionId) {
        log.info("Creating or getting chatbot for session: {}", sessionId);
        ChatBotDto chatbot = chatBotService.createOrGetChatBotForSession(sessionId);
        return ResponseEntity.ok(chatbot);
    }
}
