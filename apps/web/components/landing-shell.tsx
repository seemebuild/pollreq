import React from "react";
import Link from "next/link";

const checklist = [
  {
    title: "Auth and workspace setup",
    body: "Sign in, create a business workspace, and land in a dashboard that is ready for action."
  },
  {
    title: "One-question poll creation",
    body: "Keep the MVP fast by focusing on a single decision-driving question per poll."
  },
  {
    title: "Public responses and analytics",
    body: "Share a link, collect responses, and turn them into a clear signal for the next move."
  }
] as const;

const firstMilestoneFlow = [
  {
    title: "Foundation first",
    body: "Turbo workspace, Better Auth boundary, Convex schema, and test harness."
  },
  {
    title: "Poll flow second",
    body: "Draft a poll, publish it, generate a public link, and accept responses."
  },
  {
    title: "Insight loop third",
    body: "Give creators a dashboard that explains what customers said and what changed."
  }
] as const;

const stats = [
  { value: "TDD", label: "Delivery rule from the first milestone" },
  { value: "Turbo", label: "Monorepo foundation for web and mobile" },
  { value: "Convex", label: "Shared backend and realtime data layer" }
] as const;

export function LandingShell() {
  return (
    <main className="page-shell">
      <div className="hero-grid">
        <section className="hero-card">
          <div className="eyebrow">
            <span>PollReq MVP</span>
            <span>Feedback that leads to action</span>
          </div>
          <h1 className="hero-title">Customer feedback for teams that need answers fast.</h1>
          <p className="hero-copy">
            PollReq helps builders and small businesses ask one clear question, share it in minutes,
            and spot the signal that should shape the next product or business decision.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/sign-up">
              Create account
            </Link>
            <Link className="button button-secondary" href="/sign-in">
              Sign in
            </Link>
            <a className="button button-secondary" href="#milestones">
              Review first milestone
            </a>
          </div>
          <div className="stats-row" aria-label="Product foundations">
            {stats.map((stat) => (
              <div className="stat-pill" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="info-grid">
          <section className="info-card" id="milestones">
            <p className="section-heading">Build Focus</p>
            <ul className="checklist">
              {checklist.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="info-card" id="tdd">
            <p className="section-heading">First Milestone</p>
            <ol className="flow-list">
              {firstMilestoneFlow.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="accent-block">
            <strong>Implementation note</strong>
            <span>
              The repo is now structured to support a TDD-first web launch while preserving a clean
              path to a future mobile client in the same monorepo.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
