export function hasConvexDeployment() {
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}
