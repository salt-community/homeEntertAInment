import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSessions } from "../useSessions";
import React from "react";
import { ClerkProvider } from "@clerk/clerk-react";

// Mock the API client
const mockAuthenticatedFetch = vi.fn();
vi.mock("../../services/apiClient", () => ({
  useAuthenticatedFetch: () => mockAuthenticatedFetch,
}));

// Mock Clerk
vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({
    isSignedIn: true,
    isLoaded: true,
    user: { id: "test-user" },
  }),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      ClerkProvider,
      { publishableKey: "test-key" },
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      )
    );

  return wrapper;
};

describe("useSessions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock setup
    mockAuthenticatedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it("should return initial loading state", () => {
    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.sessions).toEqual([]);
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
    mockAuthenticatedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSessions),
    });

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
    mockAuthenticatedFetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sessions).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });

  it("should provide refetch function", () => {
    const { result } = renderHook(() => useSessions(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.refetch).toBe("function");
  });

  it("should handle empty sessions array", async () => {
    mockAuthenticatedFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

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
