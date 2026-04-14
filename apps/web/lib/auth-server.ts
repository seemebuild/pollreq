import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { NextResponse } from "next/server";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

const authHelpers =
  convexUrl && convexSiteUrl
    ? convexBetterAuthNextJs({
        convexUrl,
        convexSiteUrl
      })
    : null;

function misconfiguredResponse() {
  return NextResponse.json(
    {
      error:
        "Auth is not configured yet. Set NEXT_PUBLIC_CONVEX_URL and NEXT_PUBLIC_CONVEX_SITE_URL after initializing Convex."
    },
    { status: 503 }
  );
}

export const handler = authHelpers?.handler ?? {
  GET: misconfiguredResponse,
  POST: misconfiguredResponse
};

export async function getToken() {
  return authHelpers ? authHelpers.getToken() : null;
}

export async function isAuthenticated() {
  return authHelpers ? authHelpers.isAuthenticated() : false;
}
