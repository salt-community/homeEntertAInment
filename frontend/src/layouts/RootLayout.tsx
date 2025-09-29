import { Outlet } from "@tanstack/react-router";
import { AppHeader } from "../components/AppHeader";
import { ResponsiveBackground } from "../components/ResponsiveBackground";

export default function RootLayout() {
  return (
    <ResponsiveBackground className="text-white">
      <AppHeader />
      <main className="w-full">
        <Outlet />
      </main>
    </ResponsiveBackground>
  );
}
