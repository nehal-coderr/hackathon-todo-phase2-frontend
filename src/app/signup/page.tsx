// Task ID: T021, T024, T075 - Signup page with soothing theme
"use client";

import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

/**
 * User registration page.
 *
 * Per User Story 1 (P1): User Registration
 * - A new user visits the application and creates an account
 * - Upon successful registration, they can immediately access their empty task list
 *
 * Acceptance Scenarios:
 * - Valid email + password (min 8 chars) → redirect to dashboard
 * - Duplicate email → error message
 * - Invalid email format → validation error
 * - Password < 8 chars → validation error
 */
export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-soft">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-muted">
            Sign up to start managing your tasks
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-2xl shadow-soft border border-border p-6">
          <AuthForm mode="signup" />
        </div>

        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
