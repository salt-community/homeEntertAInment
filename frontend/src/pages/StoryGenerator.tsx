import { StoryForm } from "../story/components";
import { useGenerateStory } from "../story/hooks";
import { useNavigate } from "@tanstack/react-router";

export default function StoryGenerator() {
  const { loading, error } = useGenerateStory();
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col items-center space-y-6">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold">Story Generator</h2>
        <p className="text-sm text-gray-600">
          Enter prompts to generate a story.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <StoryForm
          onSubmit={async (payload) => {
            sessionStorage.setItem("storyRequest", JSON.stringify(payload));
            navigate({ to: "/story-generator/result" });
          }}
          disabled={loading}
        />
      </div>

      <div className="w-full max-w-2xl">
        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* Result moved to /story-generator/result */}
    </div>
  );
}
