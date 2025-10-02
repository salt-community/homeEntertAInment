import { Link } from "@tanstack/react-router";

const Card = ({
  title,
  description,
  to,
  gradientDirection = "pinkToBlue",
}: {
  title: string;
  description: string;
  to: string;
  gradientDirection?: "pinkToBlue" | "blueToPink";
}) => {
  const frameClass =
    gradientDirection === "pinkToBlue"
      ? "bg-gradient-to-r from-[#F930C7] to-[#3076F9]"
      : "bg-gradient-to-r from-[#3076F9] to-[#F930C7]";

  return (
    <div
      className={`rounded-xl p-[2px] ${frameClass} hover:scale-105 transition-transform duration-300`}
    >
      <Link
        to={to}
        className="group block rounded-[10px] bg-black p-4 sm:p-6 lg:p-8 h-full"
      >
        <h2 className="mb-3 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-white/90">
          {description}
        </p>
      </Link>
    </div>
  );
};

export default function Home() {
  return (
    <div
      className="w-full text-center relative pt-4 sm:pt-20 min-h-screen bg-black bg-no-repeat bg-cover bg-center m-0 p-0"
      style={{ backgroundImage: "url('/landing-bg.png')" }}
    >
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Welcome to Home Entertainment System
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            Your one-stop destination for entertainment tools. Generate stories,
            pick movies, settle board game disputes, and create quizzes - all
            powered by AI.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2">
          <Card
            to="/story"
            title="Story Generator"
            description="Bring your imagination to life. Provide characters, settings, or themes and get a unique tale for instant fun."
            gradientDirection="pinkToBlue"
          />
          <Card
            to="/board-game-rule-inspector"
            title="Boardgame Rule Assistant"
            description="No more arguments over rules. Quickly explains, clarifies, and settles disputes so the fun keeps going."
            gradientDirection="blueToPink"
          />
          <Card
            to="/movie-mood"
            title="Movie Picker"
            description="Unsure what to watch? Get smart recommendations based on mood, preferences, and the night's vibe."
            gradientDirection="pinkToBlue"
          />
          <Card
            to="/quiz"
            title="Quiz Generator"
            description="Turn any topic into a game night. Builds a tailored quiz with fun, challenging, shareable questions."
            gradientDirection="blueToPink"
          />
        </div>
      </section>
    </div>
  );
}
