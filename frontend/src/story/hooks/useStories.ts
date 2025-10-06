import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createStoryApi } from "../api";
import { useAuthenticatedFetch } from "../../services/apiClient";
import type { CreateStoryRequest, UpdateStoryRequest } from "../types";

export const useStories = () => {
  const authenticatedFetch = useAuthenticatedFetch();
  const storyApi = createStoryApi(authenticatedFetch);

  return useQuery({
    queryKey: ["stories"],
    queryFn: storyApi.getStories,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStory = (id: string) => {
  const authenticatedFetch = useAuthenticatedFetch();
  const storyApi = createStoryApi(authenticatedFetch);

  return useQuery({
    queryKey: ["stories", id],
    queryFn: () => storyApi.getStory(id),
    enabled: !!id,
  });
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  const authenticatedFetch = useAuthenticatedFetch();
  const storyApi = createStoryApi(authenticatedFetch);

  return useMutation({
    mutationFn: (storyData: CreateStoryRequest) =>
      storyApi.createStory(storyData),
    onSuccess: () => {
      // Invalidate and refetch stories list
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
};

export const useUpdateStory = () => {
  const queryClient = useQueryClient();
  const authenticatedFetch = useAuthenticatedFetch();
  const storyApi = createStoryApi(authenticatedFetch);

  return useMutation({
    mutationFn: (storyData: UpdateStoryRequest) =>
      storyApi.updateStory(storyData),
    onSuccess: (updatedStory) => {
      // Update the specific story in cache
      queryClient.setQueryData(["stories", updatedStory.id], updatedStory);
      // Invalidate stories list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();
  const authenticatedFetch = useAuthenticatedFetch();
  const storyApi = createStoryApi(authenticatedFetch);

  return useMutation({
    mutationFn: (id: string) => storyApi.deleteStory(id),
    onSuccess: (_, deletedId) => {
      // Remove the story from cache
      queryClient.removeQueries({ queryKey: ["stories", deletedId] });
      // Invalidate stories list
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
};
