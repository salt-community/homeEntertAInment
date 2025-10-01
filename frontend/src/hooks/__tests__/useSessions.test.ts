import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSessions } from "../useSessions";
import React from "react";

// Mock the API client
vi.mock("../../services/apiClient", () => ({
  useAuthenticatedFetch: () =>
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useSessions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial loading state", () => {
    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.sessions).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it("should fetch sessions successfully", async () => {
    const mockSessions = [
      {
        id: 1,
        gameName: "Monopoly",
        gameState: "playing",
        isActive: true,
        createdAt: "2023-01-01T10:00:00Z",
        clerkUserId: "user123",
        players: [],
      },
    ];

    // Mock the authenticated fetch to return sessions
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSessions),
    });

    vi.doMock("../../services/apiClient", () => ({
      useAuthenticatedFetch: () => mockFetch,
    }));

    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sessions).toEqual(mockSessions);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));

    vi.doMock("../../services/apiClient", () => ({
      useAuthenticatedFetch: () => mockFetch,
    }));

    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sessions).toBeUndefined();
    expect(result.current.error).toBeTruthy();
  });

  it("should provide refetch function", () => {
    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.refetch).toBe("function");
  });

  it("should handle empty sessions array", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    vi.doMock("../../services/apiClient", () => ({
      useAuthenticatedFetch: () => mockFetch,
    }));

    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sessions).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
