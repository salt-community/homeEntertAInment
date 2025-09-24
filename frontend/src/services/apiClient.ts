import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

/**
 * API client utility that automatically includes Clerk JWT token in requests
 */
export const createAuthenticatedFetch = () => {
  const { getToken } = useAuth();

  return async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = await getToken();
    
    const headers = {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };
};

/**
 * Hook that provides an authenticated fetch function
 */
export const useAuthenticatedFetch = () => {
  const { getToken } = useAuth();

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = await getToken();
    
    const headers = {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }, [getToken]);

  return authenticatedFetch;
};
