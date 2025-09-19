import { Link, Outlet } from "@tanstack/react-router";

export default function RootLayout() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <nav
        style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}
      >
        <Link to="/">Home</Link>
        <Link to="/story-generator">Story Generator</Link>
        <Link to="/board-game-rule-inspector">Board Game Rule Inspector</Link>
        <Link to="/movie-mood">Movie Mood</Link>
        <Link to="/quiz">Quiz Generator</Link>
      </nav>
      <Outlet />
    </div>
  );
}
