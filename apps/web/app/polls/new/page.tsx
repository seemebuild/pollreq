import { redirect } from "next/navigation";
import { PollEditor } from "@/components/poll-editor";
import { isAuthenticated } from "@/lib/auth-server";

export default async function NewPollPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  return (
    <main className="page-shell">
      <div className="hero-grid" style={{ gridTemplateColumns: "1fr" }}>
        <section className="hero-card" style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="eyebrow">
            <span>Poll Builder</span>
            <span>Convex persistence</span>
          </div>
          <h1 className="hero-title" style={{ maxWidth: "12ch", fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
            Shape a decision-ready poll draft.
          </h1>
          <p className="hero-copy">
            This editor now saves authenticated one-question poll drafts into Convex so creators can
            build in short loops without losing their work.
          </p>
        </section>

        <PollEditor />
      </div>
    </main>
  );
}
