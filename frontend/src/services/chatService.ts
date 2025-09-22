/**
 * Chat service for handling chat-related API calls
 */

import { API_ENDPOINTS } from "./api";
import type {
  ChatEntry,
  ChatBot,
  CreateChatEntryRequest,
} from "../types/gameSession";

export class ChatService {
  /**
   * Get all chat entries for a session
   */
  static async getChatEntries(sessionId: number): Promise<ChatEntry[]> {
    const response = await fetch(API_ENDPOINTS.CHAT_ENTRIES(sessionId));
    if (!response.ok) {
      throw new Error(`Failed to fetch chat entries: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Create a new chat entry
   */
  static async createChatEntry(
    sessionId: number,
    request: CreateChatEntryRequest
  ): Promise<ChatEntry> {
    const response = await fetch(API_ENDPOINTS.CREATE_CHAT_ENTRY(sessionId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to create chat entry: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Create or get chatbot for a session
   */
  static async createChatBot(sessionId: number): Promise<ChatBot> {
    const response = await fetch(API_ENDPOINTS.CREATE_CHATBOT(sessionId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create chatbot: ${response.statusText}`);
    }
    return response.json();
  }
}
