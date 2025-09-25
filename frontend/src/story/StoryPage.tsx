import React, { useEffect } from "react";
import { StoryViewer } from "./components";
import { useGenerateStory } from "./hooks";
import type { StoryRequest } from "./types";

interface StoryPageProps {
  /** The story request parameters to send to the backend */
  storyRequest: StoryRequest;
}

/**
 * A complete page component that fetches a story from the backend and renders it as markdown.
 * Uses React Query for data fetching and displays loading/error states.
 *
 * @example
 * ```tsx
 * const storyRequest = {
 *   character: "A brave knight",
 *   theme: [Theme.ADVENTURE],
 *   ageGroup: AgeGroup.AGE_7_8
 * };
 * <StoryPage storyRequest={storyRequest} />
 * ```
 */

export const StoryPage: React.FC<StoryPageProps> = ({ storyRequest }) => {
  const {
    data: storyResponse,
    loading: isLoading,
    error,
    submit,
  } = useGenerateStory();

  useEffect(() => {
    if (storyRequest) {
      submit(storyRequest);
    }
  }, [storyRequest, submit]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Generating your story...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">
          Error generating story: {error}
        </div>
      </div>
    );
  }

  if (!storyResponse?.story) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No story content available.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StoryViewer markdown={storyResponse.story} />
    </div>
  );
};
