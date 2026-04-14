import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <main className="page-shell">
      <div className="hero-grid" style={{ gridTemplateColumns: "1fr" }}>
        <section className="hero-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="eyebrow">
            <span>Sign in</span>
            <span>Builder access</span>
          </div>
          <h1 className="hero-title" style={{ maxWidth: "10ch", fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
            Return to your feedback workspace.
          </h1>
          <p className="hero-copy">
            Access your polls, responses, and dashboard with the Better Auth and Convex integration
            path that will support the rest of the product.
          </p>
        </section>

        <AuthForm mode="sign-in" />
      </div>
    </main>
  );
}
