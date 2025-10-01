import { describe, it, expect } from "vitest";
import type {
  ChatEntry,
  CreateChatEntryRequest,
  ChatBot,
  Session,
  Player,
} from "../gameSession";

describe("GameSession Types", () => {
  describe("ChatEntry", () => {
    it("should have correct structure", () => {
      const chatEntry: ChatEntry = {
        id: 1,
        chatbotId: 1,
        sessionId: 1,
        creator: "PLAYER",
        content: "Test message",
        createdAt: "2023-01-01T10:00:00Z",
      };

      expect(chatEntry.id).toBe(1);
      expect(chatEntry.creator).toBe("PLAYER");
      expect(chatEntry.content).toBe("Test message");
      expect(typeof chatEntry.createdAt).toBe("string");
    });

    it("should allow AI creator", () => {
      const aiChatEntry: ChatEntry = {
        id: 2,
        chatbotId: 1,
        sessionId: 1,
        creator: "AI",
        content: "AI response",
        createdAt: "2023-01-01T10:01:00Z",
      };

      expect(aiChatEntry.creator).toBe("AI");
    });
  });

  describe("CreateChatEntryRequest", () => {
    it("should have correct structure", () => {
      const request: CreateChatEntryRequest = {
        content: "Test message",
        creator: "PLAYER",
      };

      expect(request.content).toBe("Test message");
      expect(request.creator).toBe("PLAYER");
    });

    it("should allow AI creator in request", () => {
      const aiRequest: CreateChatEntryRequest = {
        content: "AI message",
        creator: "AI",
      };

      expect(aiRequest.creator).toBe("AI");
    });
  });

  describe("ChatBot", () => {
    it("should have correct structure", () => {
      const chatBot: ChatBot = {
        id: 1,
        name: "Board Game Rules Assistant",
        isActive: true,
        sessionId: 1,
        createdAt: "2023-01-01T09:00:00Z",
      };

      expect(chatBot.id).toBe(1);
      expect(chatBot.name).toBe("Board Game Rules Assistant");
      expect(chatBot.isActive).toBe(true);
      expect(chatBot.sessionId).toBe(1);
      expect(typeof chatBot.createdAt).toBe("string");
    });

    it("should allow inactive chatbot", () => {
      const inactiveChatBot: ChatBot = {
        id: 2,
        name: "Inactive Bot",
        isActive: false,
        sessionId: 2,
        createdAt: "2023-01-01T09:00:00Z",
      };

      expect(inactiveChatBot.isActive).toBe(false);
    });
  });

  describe("Player", () => {
    it("should have correct structure", () => {
      const player: Player = {
        id: 1,
        playerName: "Alice",
        sessionId: 1,
      };

      expect(player.id).toBe(1);
      expect(player.playerName).toBe("Alice");
      expect(player.sessionId).toBe(1);
    });
  });

  describe("Session", () => {
    it("should have correct structure with all fields", () => {
      const session: Session = {
        id: 1,
        gameName: "Monopoly",
        gameState: "playing",
        isActive: true,
        createdAt: "2023-01-01T10:00:00Z",
        clerkUserId: "user123",
        players: [
          {
            id: 1,
            playerName: "Alice",
            sessionId: 1,
          },
          {
            id: 2,
            playerName: "Bob",
            sessionId: 1,
          },
        ],
      };

      expect(session.id).toBe(1);
      expect(session.gameName).toBe("Monopoly");
      expect(session.gameState).toBe("playing");
      expect(session.isActive).toBe(true);
      expect(session.clerkUserId).toBe("user123");
      expect(session.players).toHaveLength(2);
      expect(session.players[0].playerName).toBe("Alice");
    });

    it("should allow empty players array", () => {
      const session: Session = {
        id: 2,
        gameName: "Scrabble",
        gameState: "setup",
        isActive: true,
        createdAt: "2023-01-01T10:00:00Z",
        clerkUserId: "user456",
        players: [],
      };

      expect(session.players).toHaveLength(0);
    });

    it("should allow different game states", () => {
      const setupSession: Session = {
        id: 3,
        gameName: "Chess",
        gameState: "setup",
        isActive: true,
        createdAt: "2023-01-01T10:00:00Z",
        clerkUserId: "user789",
        players: [],
      };

      const endedSession: Session = {
        id: 4,
        gameName: "Checkers",
        gameState: "ended",
        isActive: false,
        createdAt: "2023-01-01T10:00:00Z",
        clerkUserId: "user789",
        players: [],
      };

      expect(setupSession.gameState).toBe("setup");
      expect(endedSession.gameState).toBe("ended");
      expect(endedSession.isActive).toBe(false);
    });
  });

  describe("Type compatibility", () => {
    it("should allow proper nesting of types", () => {
      const chatEntry: ChatEntry = {
        id: 1,
        chatbotId: 1,
        sessionId: 1,
        creator: "PLAYER",
        content: "Test message",
        createdAt: "2023-01-01T10:00:00Z",
      };

      const session: Session = {
        id: 1,
        gameName: "Test Game",
        gameState: "playing",
        isActive: true,
        createdAt: "2023-01-01T10:00:00Z",
        clerkUserId: "user123",
        players: [],
      };

      // Should be able to match sessionId
      expect(chatEntry.sessionId).toBe(session.id);
    });
  });
});
