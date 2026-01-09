 // Task ID: T020, T022, T023, T030, T033 - AuthForm component with validation and logout
"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, signOut, authClient } from "@/lib/auth-client";
import { clearApiCache } from "@/lib/api";

interface AuthFormProps {
  mode: "login" | "signup";
}

/**
 * Authentication form component for login and signup.
 *
 * Per FR-001: Allow new users to register with email and password
 * Per FR-002: Validate email format during registration
 * Per FR-003: Enforce minimum password length of 8 characters
 * Per FR-005: Authenticate users with email and password
 */
export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  // Task ID: T022 - Email validation (format check)
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Task ID: T023 - Password validation (min 8 chars)
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  /**
   * Verify that an authenticated session exists by checking token availability.
   * This prevents silent auth failures and dashboard 500 errors.
   */
  const verifyAuthenticatedSession = async (): Promise<boolean> => {
    try {
      // Attempt to get a JWT token which validates the session
      const response = await fetch("/api/token", {
        credentials: "include",
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return !!data?.token;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (submittingRef.current) {
      return;
    }

    setError(null);

    // Client-side validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      if (mode === "signup") {
        // Task ID: T021 - Signup
        const result = await signUp.email({
          email,
          password,
          name: email.split("@")[0], // Use email prefix as name
        });

        if (result.error) {
          // Generic error handling - avoid string matching on backend messages
          // Provide user-friendly message without revealing system details
          setError("Registration failed. Please try a different email or try again later.");
          return;
        }

        // Verify authenticated session exists before redirect
        const isAuthenticated = await verifyAuthenticatedSession();
        if (!isAuthenticated) {
          setError("Registration succeeded but session creation failed. Please try logging in.");
          return;
        }

        // Redirect to dashboard on successful signup
        router.push("/dashboard");
      } else {
        // Task ID: T026 - Login
        const result = await signIn.email({
          email,
          password,
        });

        if (result.error) {
          // Task ID: T027 - Generic error message (don't reveal which field is wrong)
          setError("Invalid email or password");
          return;
        }

        // Verify authenticated session exists before redirect
        const isAuthenticated = await verifyAuthenticatedSession();
        if (!isAuthenticated) {
          setError("Login succeeded but session creation failed. Please try again.");
          return;
        }

        // Redirect to dashboard on successful login
        router.push("/dashboard");
      }
    } catch (err) {
      // Generic error for any unexpected issues
      setError(mode === "login" ? "Invalid email or password" : "Registration failed");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-border rounded-xl shadow-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full px-4 py-2.5 border border-border rounded-xl shadow-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          placeholder={mode === "signup" ? "Min 8 characters" : "••••••••"}
          disabled={loading}
        />
        {mode === "signup" && (
          <p className="text-xs text-muted mt-1">
            Must be at least 8 characters
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-error/30 rounded-xl">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-soft disabled:bg-primary-light disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </>
        ) : mode === "login" ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Sign Up
          </>
        )}
      </button>
    </form>
  );
}

/**
 * Task ID: T030 - Logout button component.
 *
 * Per FR-009: Allow users to log out and invalidate their session
 * Per FR-022: Frontend MUST invalidate all cached task data on logout
 */
export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // 1. Invalidate session first (most critical step)
      await signOut();

      // 2. Then clear API cache (after session is invalid)
      // T033: Clear API cache on logout
      clearApiCache();

      // 3. Finally redirect (Per FR-022: Cache is invalidated)
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even on error, attempt to clear cache and redirect for security
      clearApiCache();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-alt rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
