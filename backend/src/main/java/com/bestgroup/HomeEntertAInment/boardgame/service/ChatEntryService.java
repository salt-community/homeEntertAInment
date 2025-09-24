package com.bestgroup.HomeEntertAInment.boardgame.service;

import com.bestgroup.HomeEntertAInment.boardgame.dto.ChatEntryDto;
import com.bestgroup.HomeEntertAInment.boardgame.dto.CreateChatEntryRequest;
import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatBot;
import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatEntry;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatBotRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.ChatEntryRepository;
import com.bestgroup.HomeEntertAInment.boardgame.repository.SessionRepository;
import com.bestgroup.HomeEntertAInment.service.GeminiService;
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
    private final GeminiService geminiService;

    /**
     * Get all chat entries for a session and user ordered by creation time
     */
    public List<ChatEntryDto> getChatEntriesBySessionIdAndUser(Long sessionId, String clerkUserId) {
        log.info("Getting chat entries for session: {} and user: {}", sessionId, clerkUserId);
        List<ChatEntry> entries = chatEntryRepository.findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(sessionId, clerkUserId);
        return entries.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get all chat entries for a session ordered by creation time (deprecated - use getChatEntriesBySessionIdAndUser instead)
     */
    @Deprecated
    public List<ChatEntryDto> getChatEntriesBySessionId(Long sessionId) {
        log.info("Getting chat entries for session: {}", sessionId);
        List<ChatEntry> entries = chatEntryRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        return entries.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Create a new chat entry and trigger AI response if it's from a player for a specific user
     */
    @Transactional
    public ChatEntryDto createChatEntryForUser(Long sessionId, CreateChatEntryRequest request, String clerkUserId) {
        log.info("Creating chat entry for session: {} with content: {} for user: {}", sessionId, request.getContent(), clerkUserId);
        
        // Get session, ensuring it belongs to the user
        Session session = sessionRepository.findByIdAndClerkUserId(sessionId, clerkUserId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId + " for user: " + clerkUserId));

        // Get or create chatbot for session
        ChatBot chatBot = chatBotRepository.findBySession_IdAndClerkUserId(sessionId, clerkUserId)
                .orElseThrow(() -> new RuntimeException("ChatBot not found for session: " + sessionId + " and user: " + clerkUserId));

        // Create chat entry
        ChatEntry chatEntry = ChatEntry.builder()
                .content(request.getContent())
                .creator(request.getCreator())
                .chatBot(chatBot)
                .session(session)
                .clerkUserId(clerkUserId)
                .build();

        ChatEntry savedEntry = chatEntryRepository.save(chatEntry);
        log.info("Created chat entry with id: {} for session: {} and user: {}", savedEntry.getId(), sessionId, clerkUserId);
        
        // If this is a player message, generate AI response
        if ("PLAYER".equals(request.getCreator())) {
            generateAIResponseForUser(sessionId, request.getContent(), session, chatBot, clerkUserId);
        }
        
        return convertToDto(savedEntry);
    }

    /**
     * Create a new chat entry and trigger AI response if it's from a player (deprecated - use createChatEntryForUser instead)
     */
    @Deprecated
    @Transactional
    public ChatEntryDto createChatEntry(Long sessionId, CreateChatEntryRequest request) {
        log.info("Creating chat entry for session: {} with content: {}", sessionId, request.getContent());
        
        // Get session
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        // Get or create chatbot for session
        ChatBot chatBot = chatBotRepository.findBySession_Id(sessionId)
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
        
        // If this is a player message, generate AI response
        if ("PLAYER".equals(request.getCreator())) {
            generateAIResponse(sessionId, request.getContent(), session, chatBot);
        }
        
        return convertToDto(savedEntry);
    }

    /**
     * Generate AI response for a player's question for a specific user
     */
    private void generateAIResponseForUser(Long sessionId, String userQuestion, Session session, ChatBot chatBot, String clerkUserId) {
        try {
            log.info("Generating AI response for session: {} and question: {} for user: {}", sessionId, userQuestion, clerkUserId);
            
            // Get chat history for this user
            List<ChatEntry> chatHistory = chatEntryRepository.findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(sessionId, clerkUserId);
            String chatHistoryText = chatHistory.stream()
                    .map(entry -> entry.getCreator() + ": " + entry.getContent())
                    .collect(Collectors.joining("\n"));
            
            // Get players list
            String playersList = session.getPlayers().stream()
                    .map(player -> player.getPlayerName())
                    .collect(Collectors.joining(", "));
            
            // Get rule set data
            String ruleSetData = session.getRuleSet() != null ? 
                    session.getRuleSet().getDecodedData() : "No rules available";
            
            // Generate AI response
            String aiResponse = geminiService.generateGameRuleResponse(
                    chatHistoryText, userQuestion, playersList, ruleSetData);
            
            // Create AI chat entry
            ChatEntry aiEntry = ChatEntry.builder()
                    .content(aiResponse)
                    .creator("AI")
                    .chatBot(chatBot)
                    .session(session)
                    .clerkUserId(clerkUserId)
                    .build();
            
            chatEntryRepository.save(aiEntry);
            log.info("Created AI response for session: {} and user: {}", sessionId, clerkUserId);
            
        } catch (Exception e) {
            log.error("Error generating AI response for session {} and user {}: {}", sessionId, clerkUserId, e.getMessage(), e);
            
            // Create fallback AI response
            ChatEntry fallbackEntry = ChatEntry.builder()
                    .content("Sorry for the trouble, but the AI agent is not working right now. Please try again later or check the rule book for more details.")
                    .creator("AI")
                    .chatBot(chatBot)
                    .session(session)
                    .clerkUserId(clerkUserId)
                    .build();
            
            chatEntryRepository.save(fallbackEntry);
        }
    }

    /**
     * Generate AI response for a player's question (deprecated - use generateAIResponseForUser instead)
     */
    @Deprecated
    private void generateAIResponse(Long sessionId, String userQuestion, Session session, ChatBot chatBot) {
        try {
            log.info("Generating AI response for session: {} and question: {}", sessionId, userQuestion);
            
            // Get chat history
            List<ChatEntry> chatHistory = chatEntryRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
            String chatHistoryText = chatHistory.stream()
                    .map(entry -> entry.getCreator() + ": " + entry.getContent())
                    .collect(Collectors.joining("\n"));
            
            // Get players list
            String playersList = session.getPlayers().stream()
                    .map(player -> player.getPlayerName())
                    .collect(Collectors.joining(", "));
            
            // Get rule set data
            String ruleSetData = session.getRuleSet() != null ? 
                    session.getRuleSet().getDecodedData() : "No rules available";
            
            // Generate AI response
            String aiResponse = geminiService.generateGameRuleResponse(
                    chatHistoryText, userQuestion, playersList, ruleSetData);
            
            // Create AI chat entry
            ChatEntry aiEntry = ChatEntry.builder()
                    .content(aiResponse)
                    .creator("AI")
                    .chatBot(chatBot)
                    .session(session)
                    .build();
            
            chatEntryRepository.save(aiEntry);
            log.info("Created AI response for session: {}", sessionId);
            
        } catch (Exception e) {
            log.error("Error generating AI response for session {}: {}", sessionId, e.getMessage(), e);
            
            // Create fallback AI response
            ChatEntry fallbackEntry = ChatEntry.builder()
                    .content("Sorry for the trouble, but the AI agent is not working right now. Please try again later or check the rule book for more details.")
                    .creator("AI")
                    .chatBot(chatBot)
                    .session(session)
                    .build();
            
            chatEntryRepository.save(fallbackEntry);
        }
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
