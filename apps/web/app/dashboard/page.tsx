import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  return (
    <main className="page-shell">
      <section className="hero-card" style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="eyebrow">
          <span>Dashboard</span>
          <span>Protected route</span>
        </div>
        <h1 className="hero-title" style={{ maxWidth: "12ch", fontSize: "clamp(2.6rem, 7vw, 4.4rem)" }}>
          Your authenticated workspace will land here.
        </h1>
        <p className="hero-copy">
          The next implementation slice should connect this route to a real workspace record in Convex
          and surface the creator&apos;s active polls.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/polls/new">
            Draft a poll
          </Link>
        </div>
      </section>
    </main>
  );
}
