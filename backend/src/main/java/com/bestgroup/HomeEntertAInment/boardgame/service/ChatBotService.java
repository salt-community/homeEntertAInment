package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatBotDto;
import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatBot;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatBotRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service for ChatBot operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatBotService {

    private final ChatBotRepository chatBotRepository;
    private final SessionRepository sessionRepository;

    /**
     * Create or get existing chatbot for a session
     */
    @Transactional
    public ChatBotDto createOrGetChatBotForSession(Long sessionId) {
        log.info("Creating or getting chatbot for session: {}", sessionId);
        
        // Check if chatbot already exists
        Optional<ChatBot> existingChatBot = chatBotRepository.findBySessionId(sessionId);
        if (existingChatBot.isPresent()) {
            log.info("ChatBot already exists for session: {}", sessionId);
            return convertToDto(existingChatBot.get());
        }

        // Get session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        // Create new chatbot
        ChatBot chatBot = ChatBot.builder()
                .name("Board Game Rules Assistant")
                .isActive(true)
                .session(session)
                .build();

        ChatBot savedChatBot = chatBotRepository.save(chatBot);
        log.info("Created new ChatBot with id: {} for session: {}", savedChatBot.getId(), sessionId);
        
        return convertToDto(savedChatBot);
    }

    /**
     * Get chatbot for a session
     */
    public Optional<ChatBotDto> getChatBotBySessionId(Long sessionId) {
        log.info("Getting chatbot for session: {}", sessionId);
        return chatBotRepository.findBySessionId(sessionId)
                .map(this::convertToDto);
    }

    /**
     * Convert ChatBot entity to DTO
     */
    private ChatBotDto convertToDto(ChatBot chatBot) {
        return ChatBotDto.builder()
                .id(chatBot.getId())
                .name(chatBot.getName())
                .isActive(chatBot.getIsActive())
                .sessionId(chatBot.getSession().getId())
                .createdAt(chatBot.getCreatedAt())
                .build();
    }
}
