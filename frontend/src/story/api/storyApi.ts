import type { Story, CreateStoryRequest, UpdateStoryRequest } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const createStoryApi = (
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>
) => ({
  // Get all stories for the current user
  getStories: async (): Promise<Story[]> => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/stories`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }

    const stories = await response.json();
    return stories;
  },

  // Get a specific story by ID
  getStory: async (id: string): Promise<Story> => {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/stories/${id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch story: ${response.statusText}`);
    }
    return response.json();
  },

  // Create a new story
  createStory: async (storyData: CreateStoryRequest): Promise<Story> => {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storyData),
    });
    if (!response.ok) {
      throw new Error(`Failed to create story: ${response.statusText}`);
    }
    return response.json();
  },

  // Update an existing story
  updateStory: async (storyData: UpdateStoryRequest): Promise<Story> => {
    const { id, ...updateData } = storyData;
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/stories/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to update story: ${response.statusText}`);
    }
    return response.json();
  },

  // Delete a story
  deleteStory: async (id: string): Promise<void> => {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/stories/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete story: ${response.statusText}`);
    }
  },
});
