import type { NextRequest } from "next/server";
import { handlers, isAuthConfigured } from "@@/auth";

// Auth.js endpoints, incl. the Google callback /api/auth/callback/google.
const notConfigured = () =>
  Response.json({ error: "Sign-in is not configured." }, { status: 503, headers: { "Cache-Control": "no-store" } });

export const GET = (req: NextRequest) => (isAuthConfigured() ? handlers.GET(req) : notConfigured());
export const POST = (req: NextRequest) => (isAuthConfigured() ? handlers.POST(req) : notConfigured());
