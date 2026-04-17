import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { isAuthenticated } from "@/lib/auth-server";

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  return <DashboardShell />;
}
