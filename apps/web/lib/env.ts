type AppEnv = {
  betterAuthUrl: string;
  convexUrl: string;
};

export function getPublicEnv(): AppEnv {
  return {
    betterAuthUrl: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL ?? ""
  };
}
