package com.bestgroup.HomeEntertAInment.boardgame.repository;

import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatBot;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
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
    Optional<ChatBot> findBySession_Id(Long sessionId);

    /**
     * Check if chatbot exists for session
     */
    boolean existsBySession_Id(Long sessionId);

    /**
     * Find all chatbots for a specific Clerk user
     *
     * @param clerkUserId The Clerk user ID
     * @return List of chatbots owned by the user
     */
    List<ChatBot> findByClerkUserId(String clerkUserId);

    /**
     * Find a specific chatbot by ID and Clerk user ID
     *
     * @param id The chatbot ID
     * @param clerkUserId The Clerk user ID
     * @return Optional containing the chatbot if found and owned by user
     */
    Optional<ChatBot> findByIdAndClerkUserId(Long id, String clerkUserId);

    /**
     * Find chatbot by session ID and Clerk user ID
     *
     * @param sessionId The session ID
     * @param clerkUserId The Clerk user ID
     * @return Optional containing the chatbot if found and owned by user
     */
    Optional<ChatBot> findBySession_IdAndClerkUserId(Long sessionId, String clerkUserId);
}
