import { useNavigate } from "@tanstack/react-router";
import { useStories, useDeleteStory } from "../../story/hooks";
import { StoryCard } from "../../story/components";
import { useUser } from "@clerk/clerk-react";

export default function StoryGeneratorSaved() {
  const navigate = useNavigate();
  const { data: stories, isLoading, error } = useStories();
  const deleteStoryMutation = useDeleteStory();
  const { isSignedIn, user } = useUser();

  // Debug logging
  console.log("StoryGeneratorSaved - isSignedIn:", isSignedIn);
  console.log("StoryGeneratorSaved - user:", user);
  console.log("StoryGeneratorSaved - stories:", stories);
  console.log("StoryGeneratorSaved - isLoading:", isLoading);
  console.log("StoryGeneratorSaved - error:", error);

  const handleDeleteStory = (id: string) => {
    deleteStoryMutation.mutate(id);
  };

  if (!isSignedIn) {
    return (
      <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-white">
            Your Saved Stories
          </h2>
          <p className="text-lg text-white/80 mt-4">
            Please sign in to view your saved stories.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-white">
            Your Saved Stories
          </h2>
          <p className="text-lg text-white/80 mt-4">Loading your stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
        <div className="w-full max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-white">
            Your Saved Stories
          </h2>
          <p className="text-red-500 mt-4">
            Error loading stories: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <div className="w-full max-w-4xl text-center">
        <h2 className="text-2xl font-semibold text-white">
          Your Saved Stories
        </h2>
        <p className="text-sm text-white/80">
          Manage and view your previously created stories.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        {stories && stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onDelete={handleDeleteStory}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">
              No saved stories yet
            </div>
            <button
              onClick={() => navigate({ to: "/story/new" })}
              className="bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
            >
              Create Your First Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
