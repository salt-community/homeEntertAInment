package com.bestgroup.HomeEntertAInment.boardgame.repository;

import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatEntry;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ChatEntry entity operations
 */
@Repository
public interface ChatEntryRepository extends JpaRepository<ChatEntry, Long> {

    /**
     * Find all chat entries for a session ordered by creation time ascending
     */
    @Query("SELECT ce FROM ChatEntry ce WHERE ce.session.id = :sessionId ORDER BY ce.createdAt ASC")
    List<ChatEntry> findBySessionIdOrderByCreatedAtAsc(@Param("sessionId") Long sessionId);

    /**
     * Find all chat entries for a chatbot ordered by creation time ascending
     */
    @Query("SELECT ce FROM ChatEntry ce WHERE ce.chatBot.id = :chatbotId ORDER BY ce.createdAt ASC")
    List<ChatEntry> findByChatBotIdOrderByCreatedAtAsc(@Param("chatbotId") Long chatbotId);

    /**
     * Find all chat entries for a session
     */
    List<ChatEntry> findBySession(Session session);

    /**
     * Find all chat entries for a specific Clerk user
     *
     * @param clerkUserId The Clerk user ID
     * @return List of chat entries owned by the user
     */
    List<ChatEntry> findByClerkUserId(String clerkUserId);

    /**
     * Find all chat entries for a specific Clerk user ordered by creation time ascending
     *
     * @param clerkUserId The Clerk user ID
     * @return List of chat entries owned by the user ordered by creation time ascending
     */
    List<ChatEntry> findByClerkUserIdOrderByCreatedAtAsc(String clerkUserId);

    /**
     * Find a specific chat entry by ID and Clerk user ID
     *
     * @param id The chat entry ID
     * @param clerkUserId The Clerk user ID
     * @return Optional containing the chat entry if found and owned by user
     */
    Optional<ChatEntry> findByIdAndClerkUserId(Long id, String clerkUserId);

    /**
     * Find all chat entries for a session and Clerk user ordered by creation time ascending
     *
     * @param sessionId The session ID
     * @param clerkUserId The Clerk user ID
     * @return List of chat entries for the session owned by the user ordered by creation time ascending
     */
    @Query("SELECT ce FROM ChatEntry ce WHERE ce.session.id = :sessionId AND ce.clerkUserId = :clerkUserId ORDER BY ce.createdAt ASC")
    List<ChatEntry> findBySessionIdAndClerkUserIdOrderByCreatedAtAsc(@Param("sessionId") Long sessionId, @Param("clerkUserId") String clerkUserId);

    /**
     * Find all chat entries for a chatbot and Clerk user ordered by creation time ascending
     *
     * @param chatbotId The chatbot ID
     * @param clerkUserId The Clerk user ID
     * @return List of chat entries for the chatbot owned by the user ordered by creation time ascending
     */
    @Query("SELECT ce FROM ChatEntry ce WHERE ce.chatBot.id = :chatbotId AND ce.clerkUserId = :clerkUserId ORDER BY ce.createdAt ASC")
    List<ChatEntry> findByChatBotIdAndClerkUserIdOrderByCreatedAtAsc(@Param("chatbotId") Long chatbotId, @Param("clerkUserId") String clerkUserId);
}
