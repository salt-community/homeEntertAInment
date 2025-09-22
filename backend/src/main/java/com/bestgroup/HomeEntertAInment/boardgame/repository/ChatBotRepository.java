package com.bestgroup.HomeEntertAInment.boardgame.repository;

import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatBot;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for ChatBot entity operations
 */
@Repository
public interface ChatBotRepository extends JpaRepository<ChatBot, Long> {

    /**
     * Find chatbot by session
     */
    Optional<ChatBot> findBySession(Session session);

    /**
     * Find chatbot by session ID
     */
    Optional<ChatBot> findBySessionId(Long sessionId);

    /**
     * Check if chatbot exists for session
     */
    boolean existsBySessionId(Long sessionId);
}
