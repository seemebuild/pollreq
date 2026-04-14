"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type AuthFormMode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: AuthFormMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = isSignUp
      ? await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/dashboard"
        })
      : await authClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard"
        });

    if (payload.error) {
      setErrorMessage(payload.error.message ?? "Authentication request failed.");
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(
      isSignUp
        ? "Account created. If redirects are enabled, you will be sent to your dashboard."
        : "Sign-in request accepted. If redirects are enabled, you will be sent to your dashboard."
    );
    setIsSubmitting(false);
  }

  return (
    <section className="info-card" style={{ maxWidth: 560, margin: "0 auto" }}>
      <p className="section-heading">{isSignUp ? "Create account" : "Welcome back"}</p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
        {isSignUp && (
          <div style={{ display: "grid", gap: 8 }}>
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Alicia Mensah"
              style={inputStyles}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        )}

        <div style={{ display: "grid", gap: 8 }}>
          <label htmlFor="email">
            <strong>Email</strong>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            style={inputStyles}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label htmlFor="password">
            <strong>Password</strong>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="At least 8 characters"
            style={inputStyles}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {errorMessage ? (
          <div className="accent-block" style={errorStyles}>
            <strong>Authentication error</strong>
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {successMessage ? (
          <div className="accent-block">
            <strong>Request sent</strong>
            <span>{successMessage}</span>
          </div>
        ) : null}

        <button className="button button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Working..." : isSignUp ? "Create account" : "Sign in"}
        </button>

        <p style={{ margin: 0, color: "var(--muted)" }}>
          {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
          <Link href={isSignUp ? "/sign-in" : "/sign-up"} style={{ textDecoration: "underline" }}>
            {isSignUp ? "Sign in" : "Create one"}
          </Link>
        </p>
      </form>
    </section>
  );
}

const inputStyles: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  padding: "14px 16px",
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "rgba(255, 255, 255, 0.72)",
  color: "var(--ink)"
};

const errorStyles: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(240, 127, 60, 0.22), rgba(255, 255, 255, 0.72))"
};
