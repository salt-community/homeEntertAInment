import { useParams, useNavigate } from "@tanstack/react-router";
import { useStory } from "../../story/hooks";
import { StoryViewer } from "../../story/components";

export default function StoryGeneratorView() {
  const { storyId } = useParams({ from: "/story/view/$storyId" });
  const navigate = useNavigate();
  const { data: story, isLoading, error } = useStory(storyId);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 pb-8 flex flex-col items-center space-y-6 bg-black min-h-screen">
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
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 pb-8 flex flex-col items-center space-y-6 bg-black min-h-screen">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-white">Story Not Found</h2>
          <p className="text-red-500 mt-4">
            {error ? error.message : "The requested story could not be found."}
          </p>
          <button
            onClick={() => navigate({ to: "/story/saved" })}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Saved Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 pb-8 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">{story.hero}</h2>
            <p className="text-sm text-white/80">
              Theme: {story.theme} • Tone: {story.tone}
              {story.twist && ` • Twist: ${story.twist}`}
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/story/saved" })}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Back to Saved Stories
          </button>
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
