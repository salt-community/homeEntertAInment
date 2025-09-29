import type { StoryRequest, StoryResponse } from "../types";

const BASE_URL = "http://localhost:8080";

export async function generateStory(
  request: StoryRequest
): Promise<StoryResponse> {
  const response = await fetch(`${BASE_URL}/api/story/generate`, {
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

  return (await response.json()) as StoryResponse;
}

async function safeReadText(response: Response): Promise<string | undefined> {
  try {
    return await response.text();
  } catch {
    return undefined;
  }
}
