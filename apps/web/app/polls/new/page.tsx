import { PollEditor } from "@/components/poll-editor";

export default function NewPollPage() {
  return (
    <main className="page-shell">
      <div className="hero-grid" style={{ gridTemplateColumns: "1fr" }}>
        <section className="hero-card" style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="eyebrow">
            <span>Poll Builder</span>
            <span>First product workflow</span>
          </div>
          <h1 className="hero-title" style={{ maxWidth: "12ch", fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
            Shape a decision-ready poll draft.
          </h1>
          <p className="hero-copy">
            This first editor uses the shared domain rules to guide the creator toward a publishable
            MVP poll before the Convex mutations are wired in.
          </p>
        </section>

        <PollEditor />
      </div>
    </main>
  );
}
