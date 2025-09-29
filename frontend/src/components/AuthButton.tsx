import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";

export function AuthButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-xs sm:text-sm text-gray-300 hidden sm:block">
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </span>
        <span className="text-xs text-gray-300 sm:hidden">
          {user?.firstName || "User"}
        </span>
        <SignOutButton>
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-200 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton>
      <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-[#3076F9] to-[#F930C7] hover:from-[#3076F9]/90 hover:to-[#F930C7]/90 text-white rounded-md transition-all duration-200 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl">
        Sign In
      </button>
    </SignInButton>
  );
}
