import { useCallback, useState } from "react";
import { generateStory } from "../api";
import { useAuthenticatedFetch } from "../../services/apiClient";
import type { StoryRequest, StoryResponse } from "../types";

export function useGenerateStory() {
  const [data, setData] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();

  const submit = useCallback(
    async (request: StoryRequest) => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateStory(request, authenticatedFetch);
        setData(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [authenticatedFetch]
  );

  return { data, loading, error, submit };
}
