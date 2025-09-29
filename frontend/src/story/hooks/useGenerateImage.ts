import { useState } from "react";
import { generateImage } from "../api";
import type { ImageRequest, ImageResponse } from "../types";
import { useAuthenticatedFetch } from "../../services/apiClient";

export function useGenerateImage() {
  const [data, setData] = useState<ImageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authenticatedFetch = useAuthenticatedFetch();

  const submit = async (request: ImageRequest): Promise<ImageResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateImage(request, authenticatedFetch);
      setData(response);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate image";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, submit };
}
