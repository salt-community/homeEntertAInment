import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChatService } from "../chatService";
import type { CreateChatEntryRequest } from "../../types/gameSession";

// Mock fetch function
const mockFetch = vi.fn();

describe("ChatService", () => {
  const mockSessionId = 1;
  const mockAuthenticatedFetch = mockFetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getChatEntries", () => {
    it("should fetch chat entries successfully", async () => {
      const mockChatEntries = [
        {
          id: 1,
          chatbotId: 1,
          sessionId: 1,
          creator: "PLAYER",
          content: "Test message",
          createdAt: "2023-01-01T10:00:00Z",
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockChatEntries),
      });

      const result = await ChatService.getChatEntries(
        mockSessionId,
        mockAuthenticatedFetch
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:8080/api/sessions/${mockSessionId}/chatEntries`
      );
      expect(result).toEqual(mockChatEntries);
    });

    it("should throw error when fetch fails", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(
        ChatService.getChatEntries(mockSessionId, mockAuthenticatedFetch)
      ).rejects.toThrow("Failed to fetch chat entries: Internal Server Error");
    });

    it("should throw error when network request fails", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(
        ChatService.getChatEntries(mockSessionId, mockAuthenticatedFetch)
      ).rejects.toThrow("Network error");
    });
  });

  describe("createChatEntry", () => {
    it("should create chat entry successfully", async () => {
      const mockRequest: CreateChatEntryRequest = {
        content: "Test message",
        creator: "PLAYER",
      };

      const mockResponse = {
        id: 1,
        chatbotId: 1,
        sessionId: 1,
        creator: "PLAYER",
        content: "Test message",
        createdAt: "2023-01-01T10:00:00Z",
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await ChatService.createChatEntry(
        mockSessionId,
        mockRequest,
        mockAuthenticatedFetch
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/sessions/${mockSessionId}/chatEntry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockRequest),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when creation fails", async () => {
      const mockRequest: CreateChatEntryRequest = {
        content: "Test message",
        creator: "PLAYER",
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      await expect(
        ChatService.createChatEntry(
          mockSessionId,
          mockRequest,
          mockAuthenticatedFetch
        )
      ).rejects.toThrow("Failed to create chat entry: 400 Bad Request");
    });
  });

  describe("createChatBot", () => {
    it("should create chatbot successfully", async () => {
      const mockResponse = {
        id: 1,
        name: "Board Game Rules Assistant",
        isActive: true,
        sessionId: 1,
        createdAt: "2023-01-01T09:00:00Z",
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await ChatService.createChatBot(
        mockSessionId,
        mockAuthenticatedFetch
      );

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/sessions/${mockSessionId}/chatbot`,
        {
          method: "POST",
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when chatbot creation fails", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(
        ChatService.createChatBot(mockSessionId, mockAuthenticatedFetch)
      ).rejects.toThrow("Failed to create chatbot: 500 Internal Server Error");
    });
  });

  describe("error handling", () => {
    it("should handle JSON parsing errors", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(
        ChatService.getChatEntries(mockSessionId, mockAuthenticatedFetch)
      ).rejects.toThrow("Invalid JSON");
    });

    it("should handle empty response body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(null),
      });

      const result = await ChatService.getChatEntries(
        mockSessionId,
        mockAuthenticatedFetch
      );
      expect(result).toBeNull();
    });
  });
});
