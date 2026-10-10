import { NextRequest, NextResponse } from "next/server";
import {
  getPublicProjects,
  PUBLIC_PROJECT_STATUSES,
  type PublicProjectStatus,
} from "@@/lib/projects-public";

const MAX_LIMIT = 50;
const NO_STORE = { "Cache-Control": "no-store" };

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400, headers: NO_STORE });
}

/**
 * Read-only list of the public projects, ongoing first then newest year.
 * Query: `limit` (1-50) and `status` (`ongoing` | `released`). Writes go through the admin panel only.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  let limit: number | undefined;
  const rawLimit = params.get("limit");
  if (rawLimit !== null) {
    limit = Number(rawLimit);
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      return badRequest(`limit must be a whole number from 1 to ${MAX_LIMIT}.`);
    }
  }

  const rawStatus = params.get("status");
  if (rawStatus !== null && !PUBLIC_PROJECT_STATUSES.includes(rawStatus as PublicProjectStatus)) {
    return badRequest(`status must be one of: ${PUBLIC_PROJECT_STATUSES.join(", ")}.`);
  }
  const status = (rawStatus ?? undefined) as PublicProjectStatus | undefined;

  try {
    const result = await getPublicProjects({ limit, status });
    return NextResponse.json(result, { headers: NO_STORE });
  } catch (err) {
    console.error("GET /api/projects failed", err);
    return NextResponse.json(
      { error: "Projects are unavailable right now." },
      { status: 500, headers: NO_STORE },
    );
  }
}
