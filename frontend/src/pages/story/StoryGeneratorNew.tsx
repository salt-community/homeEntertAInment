import { StoryForm } from "../../story/components";
import { useGenerateStory } from "../../story/hooks";
import { useNavigate } from "@tanstack/react-router";

export default function StoryGeneratorNew() {
  const { loading, error } = useGenerateStory();
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 pb-8 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-white">Create New Story</h2>
        <p className="text-sm text-white/80">
          Enter prompts to generate a new story.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
          <div className="rounded-[10px] bg-black p-8 text-white">
            <StoryForm
              onSubmit={async (payload) => {
                sessionStorage.setItem("storyRequest", JSON.stringify(payload));
                navigate({ to: "/story/result" });
              }}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
