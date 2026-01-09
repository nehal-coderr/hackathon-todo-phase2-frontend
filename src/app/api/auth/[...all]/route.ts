// Task ID: T019 - Better Auth API route handler
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API route handler.
 *
 * Handles all auth endpoints at /api/auth/*:
 * - POST /api/auth/sign-up/email - User registration
 * - POST /api/auth/sign-in/email - User login
 * - POST /api/auth/sign-out - User logout
 * - GET /api/auth/get-session - Get current session
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
