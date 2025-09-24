import { Link } from "@tanstack/react-router";
import { AuthButton } from "./AuthButton";

export function AppHeader() {
  return (
    <header className="w-full ">
      <div className="mx-auto w-full px-8 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide">
            <Link to="/" className="text-left block">
              <span className="text-2xl justify-left gap-5 flex flex-row bg-gradient-to-r from-[#3076F9] to-[#F930C7] w-100 bg-clip-text text-transparent">
                <img
                  src="/logo.png"
                  alt="Home Entertainment System Logo"
                  className="w-8 h-8"
                />
                Home Entertainment System
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
