import { useNavigate } from "@tanstack/react-router";

export default function StoryGenerator() {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex flex-col items-center space-y-6 bg-black min-h-screen">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-white">Story Generator</h2>
        <p className="text-sm text-white/80">
          Choose what you'd like to do with stories.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <button
          onClick={() => navigate({ to: "/story-generator/new" })}
          className="w-full rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9] hover:opacity-90 transition-opacity duration-200"
        >
          <div className="rounded-[10px] bg-black p-8 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">Create New Story</h3>
            <p className="text-sm text-white/80">
              Generate a brand new story with custom prompts and settings.
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate({ to: "/story-generator/saved" })}
          className="w-full rounded-xl p-[2px] bg-gradient-to-r from-[#3076F9] to-[#F930C7] hover:opacity-90 transition-opacity duration-200"
        >
          <div className="rounded-[10px] bg-black p-8 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">Your Saved Stories</h3>
            <p className="text-sm text-white/80">
              View, edit, and manage your previously created stories.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
