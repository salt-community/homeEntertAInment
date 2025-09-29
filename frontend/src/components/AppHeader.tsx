import { Link } from "@tanstack/react-router";
import { AuthButton } from "./AuthButton";

export function AppHeader() {
  return (
    <header className="w-full relative">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold tracking-wide">
            <Link to="/" className="text-left block">
              <span className="flex items-center gap-2 sm:gap-3 lg:gap-5 bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
                <img
                  src="/logo.png"
                  alt="Home Entertainment System Logo"
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex-shrink-0"
                />
                <span className="hidden sm:block">
                  Home Entertainment System
                </span>
                <span className="sm:hidden">HES</span>
              </span>
            </Link>
          </h1>
          <AuthButton />
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-[#F930C7] to-[#3076F9]" />
    </header>
  );
}
