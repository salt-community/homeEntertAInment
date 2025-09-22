import { Link, Outlet } from "@tanstack/react-router";
import { AppHeader } from "../components/AppHeader";

export default function RootLayout() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <AppHeader />
      <nav className="flex gap-4 flex-wrap justify-center p-4 bg-gray-900/50">
        <Link to="/" className="text-white hover:text-blue-400 transition-colors">Home</Link>
        <Link to="/story-generator" className="text-white hover:text-blue-400 transition-colors">Story Generator</Link>
        <Link to="/board-game-rule-inspector" className="text-white hover:text-blue-400 transition-colors">Board Game Rule Inspector</Link>
        <Link to="/movie-mood" className="text-white hover:text-blue-400 transition-colors">Movie Mood</Link>
        <Link to="/quiz" className="text-white hover:text-blue-400 transition-colors">Quiz Generator</Link>
      </nav>
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
