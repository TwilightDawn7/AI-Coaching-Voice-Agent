"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, useUser, SignOutButton, SignInButton } from "@clerk/nextjs";

export default function NavBar() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <p className="text-center py-4">Loading...</p>;

  return (
    <nav className="bg-white text-black shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          AI Coach
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-blue-200">
            Dashboard
          </Link>

          <SignedIn>
            {/* Profile Image */}
            {user?.imageUrl && (
              <Link href="/profile">
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-white hover:opacity-80"
                />
              </Link>
            )}
            <SignOutButton>
              <button className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white">
                Sign Out
              </button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-100">
                Sign In
              </button>
            </SignInButton>
            <Link
              href="/sign-up"
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 text-white"
            >
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
