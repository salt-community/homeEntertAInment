package com.bestgroup.HomeEntertAInment.boardgame.repository;

import com.bestgroup.HomeEntertAInment.boardgame.entity.ChatEntry;
import com.bestgroup.HomeEntertAInment.boardgame.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
