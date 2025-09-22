import { Outlet } from "@tanstack/react-router";
import { AppHeader } from "../components/AppHeader";

export default function RootLayout() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <AppHeader />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
