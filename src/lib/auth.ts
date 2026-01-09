// Task ID: T019 - Configure Better Auth server
// Per Constitution Principle III: Security-First Design with JWT

import { betterAuth } from "better-auth";
import { Pool } from "pg";

/**
 * Better Auth server configuration.
 *
 * Per FR-006: System MUST issue a secure token upon successful login
 * Per FR-007: System MUST validate token on every protected request
 */
export const auth = betterAuth({
  // Database adapter using pg Pool
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : undefined,
  }),

  // Base URL for auth endpoints
  basePath: "/api/auth",

  // Email + Password authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
  },

  // JWT session strategy for backend API compatibility
  // Per FR-006: System MUST issue a secure token upon successful login
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },

  // Secret for signing tokens
  secret: process.env.BETTER_AUTH_SECRET!,
});

/**
 * Type exports for use throughout the app.
 */
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
