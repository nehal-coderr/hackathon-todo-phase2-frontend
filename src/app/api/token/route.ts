// Task ID: T019 - JWT token generation for backend API
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignJWT } from "jose";

// Force dynamic rendering since this route uses headers
export const dynamic = "force-dynamic";

/**
 * Generate a JWT token for backend API authentication.
 *
 * Per FR-006: System MUST issue a secure token upon successful login
 * Per FR-007: System MUST validate token on every protected request
 *
 * This endpoint:
 * 1. Validates the user's Better Auth session
 * 2. Creates a standard JWT with user_id in 'sub' claim
 * 3. Signs with BETTER_AUTH_SECRET (shared with backend)
 */
export async function GET() {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Create JWT for backend API
    const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

    const token = await new SignJWT({
      sub: session.user.id,
      email: session.user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
