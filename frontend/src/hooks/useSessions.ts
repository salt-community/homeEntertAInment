import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Session, CreateSessionRequest } from "../types/gameSession";
import { API_ENDPOINTS } from "../services/api";

/**
 * Custom hook for managing game sessions
 * Provides functionality to fetch, create, and manage sessions
 */
export const useSessions = () => {
  const queryClient = useQueryClient();

  // Fetch all sessions
  const {
    data: sessions = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.SESSIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Fetch active sessions only
  const {
    data: activeSessions = [],
    isLoading: isLoadingActive,
    error: activeError,
  } = useQuery<Session[]>({
    queryKey: ["sessions", "active"],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.SESSIONS_ACTIVE);
      if (!response.ok) {
        throw new Error("Failed to fetch active sessions");
      }
      return response.json();
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  // Create new session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (request: CreateSessionRequest) => {
      const params = new URLSearchParams({
        gameName: request.gameName,
        ...(request.userId && { userId: request.userId }),
      });

      const response = await fetch(API_ENDPOINTS.SESSIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch sessions
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  // Deactivate session mutation
  const deactivateSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(API_ENDPOINTS.SESSION_BY_ID(sessionId), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate session");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch sessions
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  // Get session by ID
  const getSessionById = async (sessionId: string): Promise<Session | null> => {
    try {
      const response = await fetch(API_ENDPOINTS.SESSION_BY_ID(sessionId));
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching session:", error);
      return null;
    }
  };

  return {
    // Data
    sessions,
    activeSessions,

    // Loading states
    isLoading,
    isLoadingActive,

    // Error states
    error,
    activeError,

    // Actions
    refetch,
    createSession: createSessionMutation.mutate,
    deactivateSession: deactivateSessionMutation.mutate,
    getSessionById,

    // Mutation states
    isCreating: createSessionMutation.isPending,
    isDeactivating: deactivateSessionMutation.isPending,
    createError: createSessionMutation.error,
    deactivateError: deactivateSessionMutation.error,
  };
};
