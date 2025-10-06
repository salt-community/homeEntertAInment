import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateStory } from "../generateStory";
import type { StoryRequest, StoryResponse } from "../../types";

describe("generateStory", () => {
  const mockAuthenticatedFetch = vi.fn();
  const API_BASE_URL = "http://localhost:8080";

  const mockStoryRequest: StoryRequest = {
    character: "Dragon",
    theme: ["ADVENTURE", "FANTASY"],
    ageGroup: "AGE_7_8",
    storyLength: "MEDIUM",
    twist: "SECRET_DOOR",
    custom: "A magical adventure",
  };

  const mockStoryResponse: StoryResponse = {
    story:
      "# Dragon Adventure\n\n## Chapter 1\n\nOnce upon a time, there was a magical dragon...",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate story successfully", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockStoryResponse),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    const result = await generateStory(
      mockStoryRequest,
      mockAuthenticatedFetch
    );

    expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/story/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockStoryRequest),
      }
    );
    expect(result).toEqual(mockStoryResponse);
  });

  it("should handle request without optional fields", async () => {
    const requestWithoutOptional: StoryRequest = {
      character: "Princess",
      theme: ["FRIENDSHIP"],
      ageGroup: "AGE_5_6",
      storyLength: "SHORT",
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockStoryResponse),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    const result = await generateStory(
      requestWithoutOptional,
      mockAuthenticatedFetch
    );

    expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/story/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestWithoutOptional),
      }
    );
    expect(result).toEqual(mockStoryResponse);
  });

  it("should throw error when response is not ok", async () => {
    const mockResponse = {
      ok: false,
      statusText: "Bad Request",
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    await expect(
      generateStory(mockStoryRequest, mockAuthenticatedFetch)
    ).rejects.toThrow("Failed to generate story: Bad Request");
  });

  it("should throw error when response is not ok with status 500", async () => {
    const mockResponse = {
      ok: false,
      statusText: "Internal Server Error",
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    await expect(
      generateStory(mockStoryRequest, mockAuthenticatedFetch)
    ).rejects.toThrow("Failed to generate story: Internal Server Error");
  });

  it("should throw error when fetch fails", async () => {
    mockAuthenticatedFetch.mockRejectedValue(new Error("Network error"));

    await expect(
      generateStory(mockStoryRequest, mockAuthenticatedFetch)
    ).rejects.toThrow("Network error");
  });

  it("should throw error when JSON parsing fails", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    await expect(
      generateStory(mockStoryRequest, mockAuthenticatedFetch)
    ).rejects.toThrow("Invalid JSON");
  });

  it("should handle empty story response", async () => {
    const emptyResponse: StoryResponse = {
      story: "",
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(emptyResponse),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    const result = await generateStory(
      mockStoryRequest,
      mockAuthenticatedFetch
    );

    expect(result).toEqual(emptyResponse);
  });

  it("should handle story response with markdown content", async () => {
    const markdownResponse: StoryResponse = {
      story: `# The Dragon's Quest

## Chapter 1: The Beginning

Once upon a time, in a land far away, there lived a brave dragon named Sparkle.

## Chapter 2: The Adventure

Sparkle decided to embark on a magical journey to find the legendary crystal.

## Chapter 3: The Conclusion

After many trials and tribulations, Sparkle found the crystal and saved the kingdom.`,
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(markdownResponse),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    const result = await generateStory(
      mockStoryRequest,
      mockAuthenticatedFetch
    );

    expect(result).toEqual(markdownResponse);
    expect(result.story).toContain("# The Dragon's Quest");
    expect(result.story).toContain("## Chapter 1: The Beginning");
  });

  it("should handle request with all theme types", async () => {
    const requestWithAllThemes: StoryRequest = {
      character: "Hero",
      theme: [
        "ADVENTURE",
        "FANTASY",
        "FRIENDSHIP",
        "MYSTERY",
        "SCIENCE_FICTION",
        "COMEDY",
        "EDUCATIONAL",
        "NATURE",
      ],
      ageGroup: "AGE_9_10",
      storyLength: "FULL",
      twist: "TIME_TRAVEL",
      custom: "A complex story with multiple themes",
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockStoryResponse),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    const result = await generateStory(
      requestWithAllThemes,
      mockAuthenticatedFetch
    );

    expect(mockAuthenticatedFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/story/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestWithAllThemes),
      }
    );
    expect(result).toEqual(mockStoryResponse);
  });

  it("should handle request with different age groups", async () => {
    const ageGroups = [
      "AGE_3_4",
      "AGE_5_6",
      "AGE_7_8",
      "AGE_9_10",
      "AGE_11_12",
    ] as const;

    for (const ageGroup of ageGroups) {
      const request: StoryRequest = {
        character: "Character",
        theme: ["ADVENTURE"],
        ageGroup,
        storyLength: "SHORT",
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStoryResponse),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await generateStory(request, mockAuthenticatedFetch);

      expect(result).toEqual(mockStoryResponse);
    }
  });

  it("should handle request with different story lengths", async () => {
    const storyLengths = ["SHORT", "MEDIUM", "FULL"] as const;

    for (const storyLength of storyLengths) {
      const request: StoryRequest = {
        character: "Character",
        theme: ["ADVENTURE"],
        ageGroup: "AGE_7_8",
        storyLength,
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStoryResponse),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await generateStory(request, mockAuthenticatedFetch);

      expect(result).toEqual(mockStoryResponse);
    }
  });

  it("should handle request with different twists", async () => {
    const twists = [
      "SECRET_DOOR",
      "TALKING_ANIMAL",
      "HIDDEN_TREASURE",
      "MAGIC_SPELL",
      "UNEXPECTED_ALLY",
      "LOST_AND_FOUND",
      "TIME_TRAVEL",
      "DREAM_OR_REALITY",
      "DISGUISED_HERO",
      "FRIEND_TURNS_VILLAIN",
      "MAP_TO_ANOTHER_WORLD",
      "WISH_COMES_TRUE",
    ] as const;

    for (const twist of twists) {
      const request: StoryRequest = {
        character: "Character",
        theme: ["ADVENTURE"],
        ageGroup: "AGE_7_8",
        storyLength: "MEDIUM",
        twist,
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockStoryResponse),
      };
      mockAuthenticatedFetch.mockResolvedValue(mockResponse);

      const result = await generateStory(request, mockAuthenticatedFetch);

      expect(result).toEqual(mockStoryResponse);
    }
  });

  it("should handle custom field with special characters", async () => {
    const requestWithSpecialChars: StoryRequest = {
      character: "Dragon",
      theme: ["ADVENTURE"],
      ageGroup: "AGE_7_8",
      storyLength: "MEDIUM",
      custom: "A story with special characters: @#$%^&*()_+-=[]{}|;:,.<>?",
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockStoryResponse),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    const result = await generateStory(
      requestWithSpecialChars,
      mockAuthenticatedFetch
    );

    expect(result).toEqual(mockStoryResponse);
  });

  it("should handle custom field with unicode characters", async () => {
    const requestWithUnicode: StoryRequest = {
      character: "Dragon",
      theme: ["ADVENTURE"],
      ageGroup: "AGE_7_8",
      storyLength: "MEDIUM",
      custom: "A story with unicode: 🐉✨🌟🎭🎪🎨",
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockStoryResponse),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    const result = await generateStory(
      requestWithUnicode,
      mockAuthenticatedFetch
    );

    expect(result).toEqual(mockStoryResponse);
  });

  it("should handle very long custom field", async () => {
    const longCustom = "A".repeat(200); // Maximum length
    const requestWithLongCustom: StoryRequest = {
      character: "Dragon",
      theme: ["ADVENTURE"],
      ageGroup: "AGE_7_8",
      storyLength: "MEDIUM",
      custom: longCustom,
    };

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockStoryResponse),
    };
    mockAuthenticatedFetch.mockResolvedValue(mockResponse);

    const result = await generateStory(
      requestWithLongCustom,
      mockAuthenticatedFetch
    );

    expect(result).toEqual(mockStoryResponse);
  });

  it("should handle timeout error", async () => {
    const timeoutError = new Error("Request timeout");
    mockAuthenticatedFetch.mockRejectedValue(timeoutError);

    await expect(
      generateStory(mockStoryRequest, mockAuthenticatedFetch)
    ).rejects.toThrow("Request timeout");
  });

  it("should handle network connection error", async () => {
    const networkError = new Error("Network connection failed");
    mockAuthenticatedFetch.mockRejectedValue(networkError);

    await expect(
      generateStory(mockStoryRequest, mockAuthenticatedFetch)
    ).rejects.toThrow("Network connection failed");
  });
});
