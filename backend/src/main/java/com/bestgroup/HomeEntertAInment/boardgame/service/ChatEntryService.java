package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatEntryDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.CreateChatEntryRequest;
import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatBot;
import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatEntry;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatBotRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatEntryRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for ChatEntry operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatEntryService {

    private final ChatEntryRepository chatEntryRepository;
    private final ChatBotRepository chatBotRepository;
    private final SessionRepository sessionRepository;

    /**
     * Get all chat entries for a session ordered by creation time
     */
    public List<ChatEntryDto> getChatEntriesBySessionId(Long sessionId) {
        log.info("Getting chat entries for session: {}", sessionId);
        List<ChatEntry> entries = chatEntryRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        return entries.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Create a new chat entry
     */
    @Transactional
    public ChatEntryDto createChatEntry(Long sessionId, CreateChatEntryRequest request) {
        log.info("Creating chat entry for session: {} with content: {}", sessionId, request.getContent());
        
        // Get session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        // Get or create chatbot for session
        ChatBot chatBot = chatBotRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("ChatBot not found for session: " + sessionId));

        // Create chat entry
        ChatEntry chatEntry = ChatEntry.builder()
                .content(request.getContent())
                .creator(request.getCreator())
                .chatBot(chatBot)
                .session(session)
                .build();

        ChatEntry savedEntry = chatEntryRepository.save(chatEntry);
        log.info("Created chat entry with id: {} for session: {}", savedEntry.getId(), sessionId);
        
        return convertToDto(savedEntry);
    }

    /**
     * Convert ChatEntry entity to DTO
     */
    private ChatEntryDto convertToDto(ChatEntry chatEntry) {
        return ChatEntryDto.builder()
                .id(chatEntry.getId())
                .chatbotId(chatEntry.getChatBot().getId())
                .sessionId(chatEntry.getSession().getId())
                .creator(chatEntry.getCreator())
                .content(chatEntry.getContent())
                .createdAt(chatEntry.getCreatedAt())
                .build();
    }
}
