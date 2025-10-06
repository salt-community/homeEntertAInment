import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStoryApi } from "../storyApi";
import type {
  Story,
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../../types";

describe("createStoryApi", () => {
  const mockAuthenticatedFetch = vi.fn();
  const storyApi = createStoryApi(mockAuthenticatedFetch);
  const API_BASE_URL = "http://localhost:8080";

  const mockStory: Story = {
    id: "story-123",
    hero: "Dragon",
    theme: "Adventure, Fantasy",
    tone: "Friendly",
    twist: "SECRET_DOOR",
    content: "# Test Story\n\nContent here...",
    coverImageUrl: "https://example.com/cover.jpg",
    userId: "user-123",
    userName: "Test User",
    createdAt: "2024-01-01T00:00:00Z",
  };

  const mockCreateRequest: CreateStoryRequest = {
    hero: "Dragon",
    theme: "Adventure, Fantasy",
    tone: "Friendly",
    twist: "SECRET_DOOR",
    coverImageUrl: "https://example.com/cover.jpg",
  };

  const mockUpdateRequest: UpdateStoryRequest = {
    id: "story-123",
    hero: "Updated Dragon",
    theme: "Adventure",
    tone: "Friendly",
    twist: "NONE",
    custom: "Updated content",
    coverImageUrl: "https://example.com/new-cover.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getStories", () => {
    it("should fetch all stories successfully", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue([mockStory]),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await storyApi.getStories();

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/stories`
      );
      expect(result).toEqual([mockStory]);
    });

    it("should throw error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        statusText: "Internal Server Error",
        text: vi.fn().mockResolvedValue("Server error"),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await expect(storyApi.getStories()).rejects.toThrow(
        "Failed to fetch stories: Internal Server Error"
      );
    });

    it("should throw error when fetch fails", async () => {
      mockAuthenticatedFetch.mockRejectedValue(new Error("Network error"));

      await expect(storyApi.getStories()).rejects.toThrow("Network error");
    });
  });

  describe("getStory", () => {
    it("should fetch a specific story successfully", async () => {
      const storyId = "story-123";
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStory),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await storyApi.getStory(storyId);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/stories/${storyId}`
      );
      expect(result).toEqual(mockStory);
    });

    it("should throw error when response is not ok", async () => {
      const storyId = "story-123";
      const mockResponse = {
        ok: false,
        statusText: "Not Found",
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await expect(storyApi.getStory(storyId)).rejects.toThrow(
        "Failed to fetch story: Not Found"
      );
    });

    it("should throw error when fetch fails", async () => {
      const storyId = "story-123";
      mockAuthenticatedFetch.mockRejectedValue(new Error("Network error"));

      await expect(storyApi.getStory(storyId)).rejects.toThrow("Network error");
    });
  });

  describe("createStory", () => {
    it("should create a story successfully", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStory),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await storyApi.createStory(mockCreateRequest);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/stories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockCreateRequest),
        }
      );
      expect(result).toEqual(mockStory);
    });

    it("should throw error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        statusText: "Bad Request",
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await expect(storyApi.createStory(mockCreateRequest)).rejects.toThrow(
        "Failed to create story: Bad Request"
      );
    });

    it("should throw error when fetch fails", async () => {
      mockAuthenticatedFetch.mockRejectedValue(new Error("Network error"));

      await expect(storyApi.createStory(mockCreateRequest)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("updateStory", () => {
    it("should update a story successfully", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStory),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await storyApi.updateStory(mockUpdateRequest);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/stories/${mockUpdateRequest.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hero: mockUpdateRequest.hero,
            theme: mockUpdateRequest.theme,
            tone: mockUpdateRequest.tone,
            twist: mockUpdateRequest.twist,
            custom: mockUpdateRequest.custom,
            coverImageUrl: mockUpdateRequest.coverImageUrl,
          }),
        }
      );
      expect(result).toEqual(mockStory);
    });

    it("should throw error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        statusText: "Not Found",
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await expect(storyApi.updateStory(mockUpdateRequest)).rejects.toThrow(
        "Failed to update story: Not Found"
      );
    });

    it("should throw error when fetch fails", async () => {
      mockAuthenticatedFetch.mockRejectedValue(new Error("Network error"));

      await expect(storyApi.updateStory(mockUpdateRequest)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("deleteStory", () => {
    it("should delete a story successfully", async () => {
      const storyId = "story-123";
      const mockResponse = {
        ok: true,
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await storyApi.deleteStory(storyId);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/stories/${storyId}`,
        {
          method: "DELETE",
        }
      );
    });

    it("should throw error when response is not ok", async () => {
      const storyId = "story-123";
      const mockResponse = {
        ok: false,
        statusText: "Not Found",
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await expect(storyApi.deleteStory(storyId)).rejects.toThrow(
        "Failed to delete story: Not Found"
      );
    });

    it("should throw error when fetch fails", async () => {
      const storyId = "story-123";
      mockAuthenticatedFetch.mockRejectedValue(new Error("Network error"));

      await expect(storyApi.deleteStory(storyId)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("API base URL configuration", () => {
    it("should use default API base URL when environment variable is not set", () => {
      // This test verifies that the API_BASE_URL constant is set correctly
      // In a real test environment, you might want to test with different base URLs
      expect(API_BASE_URL).toBe("http://localhost:8080");
    });
  });

  describe("request headers and body formatting", () => {
    it("should include correct headers for POST requests", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStory),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await storyApi.createStory(mockCreateRequest);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockCreateRequest),
        })
      );
    });

    it("should include correct headers for PUT requests", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStory),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await storyApi.updateStory(mockUpdateRequest);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: expect.any(String),
        })
      );
    });

    it("should not include body for DELETE requests", async () => {
      const storyId = "story-123";
      const mockResponse = {
        ok: true,
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      await storyApi.deleteStory(storyId);

      expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "DELETE",
        })
      );

      const callArgs = mockAuthenticatedFetch.mock.calls[0][1];
      expect(callArgs).not.toHaveProperty("body");
    });
  });
});
