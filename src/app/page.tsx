// Task ID: T031 - Landing page with redirect 'logic'
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

/**
 * Landing page with authentication redirect.
 *
 * - Authenticated users → redirect to dashboard
 * - Unauthenticated users → show welcome page with login/signup links
 */
export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (session?.user && !isPending) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show welcome page for unauthenticated users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold">Todo App</h1>
        <p className="text-xl text-gray-600 max-w-md">
          A simple, secure todo application for managing your tasks.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-md transition-colors"
          >
            Create Account
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          Phase 2 - Multi-user authenticated todo application
        </p>
      </div>
    </div>
  );
}
