import { useParams, useNavigate } from "@tanstack/react-router";
import { useStory } from "../../story/hooks";
import { StoryViewer } from "../../story/components";

export default function StoryGeneratorView() {
  const { storyId } = useParams({ from: "/story/view/$storyId" });
  const navigate = useNavigate();
  const { data: story, isLoading, error } = useStory(storyId);

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-white">
            Loading Story...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-white">Story Not Found</h2>
          <p className="text-red-500 mt-4">
            {error ? error.message : "The requested story could not be found."}
          </p>
          <button
            onClick={() => navigate({ to: "/story/saved" })}
            className="mt-4 inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 text-xs text-white/70 hover:text-white transition-colors duration-200"
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <button
        onClick={() => navigate({ to: "/story/saved" })}
        className="absolute top-4 left-4 sm:left-auto sm:top-auto sm:relative sm:mb-4 z-10 inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 text-xs text-white/70 hover:text-white transition-colors duration-200"
      >
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">Back</span>
      </button>

      <div className="w-full max-w-4xl">
        <div className="mb-6 mt-8">
          <h2 className="text-2xl font-semibold text-white">{story.hero}</h2>
          <p className="text-sm text-white/80">
            Theme: {story.theme} • Tone: {story.tone}
            {story.twist && ` • Twist: ${story.twist}`}
          </p>
        </div>

        <div className="bg-black border border-gray-700 rounded-lg p-6">
          <div className="prose prose-invert max-w-none">
            <StoryViewer markdown={story.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
