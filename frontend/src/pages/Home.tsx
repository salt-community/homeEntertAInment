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
      className={`rounded-xl p-[2px] ${frameClass} hover:shadow-2xl transition-all duration-300 hover:scale-105`}
    >
      <Link
        to={to}
        className="group block rounded-[10px] bg-black p-4 sm:p-6 lg:p-8 h-full"
      >
        <h2 className="mb-3 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#3076F9] group-hover:to-[#F930C7] group-hover:bg-clip-text transition-all duration-300">
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
    <div className="w-full text-center relative pt-8 sm:pt-12 lg:pt-20 min-h-screen">
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40 -z-10" />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid gap-6 sm:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2">
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
