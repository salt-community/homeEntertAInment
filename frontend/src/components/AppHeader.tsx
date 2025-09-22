import { Link } from "@tanstack/react-router";

export function AppHeader() {
  return (
    <header className="w-full bg-gradient-to-r from-[#F930C7]/10 via-transparent to-[#3076F9]/10">
      <div className="mx-auto w-full px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide">
          <Link to="/" className="text-left block">
            <span className="text-2xl justify-center align-middle bg-gradient-to-r from-[#3076F9] to-[#F930C7] bg-clip-text text-transparent">
              Home Entertainment System
            </span>
          </Link>
        </h1>
      </div>
      <div className="h-[1px] mt-3 w-full bg-gradient-to-r from-[#F930C7] to-[#3076F9]" />
    </header>
  );
}
