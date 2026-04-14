export type AuthProviderChoice = "better-auth" | "convex-auth";

export const authProvider: AuthProviderChoice = "better-auth";

export function getAuthStatusCopy() {
  return authProvider === "better-auth"
    ? "Better Auth is the planned web auth entry point for the MVP."
    : "Convex Auth is enabled.";
}
