import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";

export function AuthButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex justify-center sm:justify-start w-full sm:w-auto">
          <span className="text-xs sm:text-sm text-gray-300 text-center sm:text-left truncate max-w-[200px] sm:max-w-none">
            Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
        </div>
        <SignOutButton>
          <button className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton>
      <button className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium">
        Sign In
      </button>
    </SignInButton>
  );
}
