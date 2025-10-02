import { Link } from "@tanstack/react-router";
import { AuthButton } from "./AuthButton";

export function AppHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto w-full px-4 sm:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-xs sm:text-2xl md:text-3xl font-semibold tracking-wide">
            <Link to="/" className="block">
              <span className="flex items-center justify-center sm:justify-start gap-1 sm:gap-3 bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
                <img
                  src="/logo.png"
                  alt="Home Entertainment System Logo"
                  className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                />
                <span className="truncate flex items-center">
                  <span className="hidden sm:inline">
                    Home Entertainment System
                  </span>
                  <span className="sm:hidden text-3xl leading-tight">
                    Home Entertainment
                  </span>
                </span>
              </span>
            </Link>
          </h1>
          <div className="flex-shrink-0">
            <AuthButton />
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-[#F930C7] to-[#3076F9]" />
    </header>
  );
}
