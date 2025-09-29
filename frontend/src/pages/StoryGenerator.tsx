import { useNavigate } from "@tanstack/react-router";

export default function StoryGenerator() {
  const navigate = useNavigate();

  return (
    <div
      className="w-full text-center relative pt-30 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
      style={{ backgroundImage: "url('/landing-bg.png')" }}
    >
      <section className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">
            Story Generator
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Create magical stories tailored to your preferences. Turn any
            character into an adventure with custom themes, twists, and
            age-appropriate content.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#F930C7] to-[#3076F9]">
            <div className="rounded-[10px] bg-black p-8 text-center">
              <h2 className="mb-4 text-3xl font-semibold tracking-wide text-white">
                Create New Story
              </h2>
              <p className="text-sm leading-6 text-white/90 mb-6">
                Generate a brand new story with custom characters, themes, and
                age-appropriate content tailored to your preferences.
              </p>
              <button
                onClick={() => navigate({ to: "/story-generator/new" })}
                className="px-8 py-3 bg-gradient-to-r from-[#F930C7] to-[#3076F9] text-white font-semibold rounded-lg shadow-md hover:from-[#F930C7]/80 hover:to-[#3076F9]/80 focus:outline-none focus:ring-2 focus:ring-[#F930C7] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                Start Creating
              </button>
            </div>
          </div>

          <div className="rounded-xl p-[2px] bg-gradient-to-r from-[#3076F9] to-[#F930C7]">
            <div className="rounded-[10px] bg-black p-8 text-center">
              <h2 className="mb-4 text-3xl font-semibold tracking-wide text-white">
                Your Saved Stories
              </h2>
              <p className="text-sm leading-6 text-white/90 mb-6">
                View, edit, and manage your previously created stories. Download
                as PDF or share with others.
              </p>
              <button
                onClick={() => navigate({ to: "/story-generator/saved" })}
                className="px-8 py-3 bg-gradient-to-r from-[#3076F9] to-[#F930C7] text-white font-semibold rounded-lg shadow-md hover:from-[#3076F9]/80 hover:to-[#F930C7]/80 focus:outline-none focus:ring-2 focus:ring-[#3076F9] focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                View Stories
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
