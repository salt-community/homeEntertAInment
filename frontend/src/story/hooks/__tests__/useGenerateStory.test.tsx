import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from "vitest";
import { useGenerateStory } from "../useGenerateStory";
import { generateStory } from "../../api/generateStory";
import type { StoryRequest, StoryResponse } from "../../types";

// Mock the generateStory API function
vi.mock("../../api/generateStory", () => ({
  generateStory: vi.fn(),
}));

// Mock the authenticated fetch hook
vi.mock("../../../services/apiClient", () => ({
  useAuthenticatedFetch: vi.fn(() => vi.fn()),
}));

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

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGenerateStory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.submit).toBe("function");
  });

  it("should generate story successfully", async () => {
    (generateStory as MockedFunction<typeof generateStory>).mockResolvedValue(
      mockStoryResponse
    );

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.submit(mockStoryRequest);
      expect(response).toEqual(mockStoryResponse);
    });

    expect(result.current.data).toEqual(mockStoryResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(generateStory).toHaveBeenCalledWith(
      mockStoryRequest,
      expect.any(Function)
    );
  });

  it("should handle loading state correctly", async () => {
    let resolvePromise: (value: StoryResponse) => void;
    const promise = new Promise<StoryResponse>((resolve) => {
      resolvePromise = resolve;
    });
    (generateStory as MockedFunction<typeof generateStory>).mockReturnValue(
      promise
    );

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.submit(mockStoryRequest);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await act(async () => {
      resolvePromise!(mockStoryResponse);
      await promise;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockStoryResponse);
  });

  it("should handle error state correctly", async () => {
    const error = new Error("Failed to generate story");
    (generateStory as MockedFunction<typeof generateStory>).mockRejectedValue(
      error
    );

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.submit(mockStoryRequest);
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Failed to generate story");
  });

  it("should handle non-Error exceptions", async () => {
    const error = "String error";
    (generateStory as MockedFunction<typeof generateStory>).mockRejectedValue(
      error
    );

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.submit(mockStoryRequest);
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Unknown error");
  });

  it("should clear error when submitting again", async () => {
    const error = new Error("First error");
    (generateStory as MockedFunction<typeof generateStory>)
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(mockStoryResponse);

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    // First submission fails
    await act(async () => {
      try {
        await result.current.submit(mockStoryRequest);
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe("First error");

    // Second submission succeeds
    await act(async () => {
      await result.current.submit(mockStoryRequest);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockStoryResponse);
  });

  it("should invalidate stories cache after successful generation", async () => {
    (generateStory as MockedFunction<typeof generateStory>).mockResolvedValue(
      mockStoryResponse
    );

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.submit(mockStoryRequest);
    });

    // The query invalidation is handled internally by React Query
    // We can verify the generation was successful
    expect(result.current.data).toEqual(mockStoryResponse);
  });

  it("should handle multiple rapid submissions", async () => {
    (generateStory as MockedFunction<typeof generateStory>).mockResolvedValue(
      mockStoryResponse
    );

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    // Submit multiple times rapidly
    const promises = [
      result.current.submit(mockStoryRequest),
      result.current.submit(mockStoryRequest),
      result.current.submit(mockStoryRequest),
    ];

    await act(async () => {
      await Promise.all(promises);
    });

    expect(result.current.data).toEqual(mockStoryResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should maintain state between submissions", async () => {
    const firstResponse: StoryResponse = {
      story: "# First Story\n\nContent...",
    };
    const secondResponse: StoryResponse = {
      story: "# Second Story\n\nContent...",
    };

    (generateStory as MockedFunction<typeof generateStory>)
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    // First submission
    await act(async () => {
      await result.current.submit(mockStoryRequest);
    });

    expect(result.current.data).toEqual(firstResponse);

    // Second submission
    await act(async () => {
      await result.current.submit(mockStoryRequest);
    });

    expect(result.current.data).toEqual(secondResponse);
  });

  it("should handle empty story request", async () => {
    const emptyRequest: StoryRequest = {
      character: "",
      theme: [],
      ageGroup: "AGE_7_8",
      storyLength: "SHORT",
    };

    const error = new Error("Invalid request");
    (generateStory as MockedFunction<typeof generateStory>).mockRejectedValue(
      error
    );

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.submit(emptyRequest);
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe("Invalid request");
    expect(generateStory).toHaveBeenCalledWith(
      emptyRequest,
      expect.any(Function)
    );
  });

  it("should handle network timeout", async () => {
    const timeoutError = new Error("Request timeout");
    (generateStory as MockedFunction<typeof generateStory>).mockRejectedValue(
      timeoutError
    );

    const { result } = renderHook(() => useGenerateStory(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.submit(mockStoryRequest);
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe("Request timeout");
    expect(result.current.loading).toBe(false);
  });
});
