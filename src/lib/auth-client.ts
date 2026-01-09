// Task ID: T019 - Better Auth client for browser use
"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Auth client for client-side components.
 *
 * Provides hooks and functions for:
 * - signUp: User registration (US1)
 * - signIn: User login (US2)
 * - signOut: User logout (US2)
 * - useSession: Get current session
 */
export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
});

// Export typed hooks and functions
export const { signIn, signUp, signOut, useSession } = authClient;
