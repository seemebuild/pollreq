import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return (
    <main className="page-shell">
      <div className="hero-grid" style={{ gridTemplateColumns: "1fr" }}>
        <section className="hero-card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="eyebrow">
            <span>Create account</span>
            <span>Start your MVP loop</span>
          </div>
          <h1 className="hero-title" style={{ maxWidth: "10ch", fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
            Set up your PollReq creator account.
          </h1>
          <p className="hero-copy">
            This creates the account foundation for workspace ownership, poll creation, and protected
            analytics once the backend mutations are connected.
          </p>
        </section>

        <AuthForm mode="sign-up" />
      </div>
    </main>
  );
}
