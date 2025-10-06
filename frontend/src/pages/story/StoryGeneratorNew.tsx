import { StoryForm } from "../../story/components";
import { useGenerateStory } from "../../story/hooks";
import { useNavigate } from "@tanstack/react-router";

export default function StoryGeneratorNew() {
  const { loading, error } = useGenerateStory();
  const navigate = useNavigate();

  return (
    <div className="relative p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <button
        onClick={() => navigate({ to: "/story" })}
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

      <div className="w-full max-w-2xl text-center mt-8">
        <h2 className="text-2xl font-semibold text-white">New Story</h2>
        <p className="text-sm text-white/80">Create your own unique story.</p>
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
