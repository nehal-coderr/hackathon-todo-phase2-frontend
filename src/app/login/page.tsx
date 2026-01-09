// Task ID: T025, T026, T027, T075 - Login page with soothing theme
"use client";

import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

/**
 * User login page.
 *
 * Per User Story 2 (P1): User Login
 * - A registered user logs in with their credentials
 * - Upon successful login, they receive a session (JWT)
 *
 * Acceptance Scenarios:
 * - Correct credentials → redirect to dashboard
 * - Incorrect credentials → generic error message (not revealing which field is wrong)
 * - Session persists on refresh
 * - Logout redirects to login page
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-soft">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted">
            Sign in to access your tasks
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
          <AuthForm mode="login" />
        </div>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
