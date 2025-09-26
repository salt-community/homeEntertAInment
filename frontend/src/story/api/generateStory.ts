import type { StoryRequest, StoryResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function generateStory(
  request: StoryRequest,
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>
): Promise<StoryResponse> {
  console.log("Sending story generation request:", request);

  const response = await authenticatedFetch(`${BASE_URL}/api/story/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  console.log("Story generation response status:", response.status);

  if (!response.ok) {
    const message = await safeReadText(response);
    console.error("Story generation failed:", response.status, message);
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  const result = (await response.json()) as StoryResponse;
  console.log("Story generation successful:", result);
  return result;
}

async function safeReadText(response: Response): Promise<string | undefined> {
  try {
    return await response.text();
  } catch {
    return undefined;
  }
}
