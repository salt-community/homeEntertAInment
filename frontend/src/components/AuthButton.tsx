import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";

export function AuthButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </span>
        <SignOutButton>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
        Sign In
      </button>
    </SignInButton>
  );
}
