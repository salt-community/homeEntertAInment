import type { ImageRequest, ImageResponse } from "../types";

const BASE_URL = "http://localhost:8080";

export async function generateImage(
  request: ImageRequest,
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>
): Promise<ImageResponse> {
  const response = await authenticatedFetch(`${BASE_URL}/api/story/image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await safeReadText(response);
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as ImageResponse;
}

async function safeReadText(response: Response): Promise<string | undefined> {
  try {
    return await response.text();
  } catch {
    return undefined;
  }
}
