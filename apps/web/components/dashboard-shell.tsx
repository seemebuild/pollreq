"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import { WorkspaceOnboardingForm } from "@/components/workspace-onboarding-form";

export function DashboardShell() {
  const viewerState = useQuery(api.workspaces.getViewerWorkspace);

  if (viewerState === undefined) {
    return (
      <main className="page-shell">
        <section className="hero-card" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="eyebrow">
            <span>Dashboard</span>
            <span>Loading</span>
          </div>
          <h1 className="hero-title" style={{ maxWidth: "12ch", fontSize: "clamp(2.6rem, 7vw, 4.4rem)" }}>
            Preparing your creator workspace.
          </h1>
          <p className="hero-copy">Fetching your account and workspace data from Convex.</p>
        </section>
      </main>
    );
  }

  if (!viewerState.isAuthenticated) {
    return null;
  }

  if (!viewerState.workspace) {
    return (
      <main className="page-shell">
        <div className="hero-grid" style={{ gridTemplateColumns: "1fr" }}>
          <section className="hero-card" style={{ maxWidth: 620, margin: "0 auto" }}>
            <div className="eyebrow">
              <span>Dashboard</span>
              <span>Setup required</span>
            </div>
            <h1 className="hero-title" style={{ maxWidth: "12ch", fontSize: "clamp(2.6rem, 7vw, 4.4rem)" }}>
              Create your workspace before building polls.
            </h1>
            <p className="hero-copy">
              We use one workspace per account in the MVP so your dashboard, polls, and responses stay
              tied to a single business context.
            </p>
          </section>

          <WorkspaceOnboardingForm />
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="hero-card" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="eyebrow">
          <span>{viewerState.workspace.businessName}</span>
          <span>{viewerState.workspace.businessType ?? "Workspace ready"}</span>
        </div>
        <h1 className="hero-title" style={{ maxWidth: "12ch", fontSize: "clamp(2.6rem, 7vw, 4.4rem)" }}>
          Your workspace is ready for the first poll.
        </h1>
        <p className="hero-copy">
          This dashboard is now connected to authenticated workspace data. The next build slice can focus
          on saving poll drafts into Convex for this business.
        </p>
        <div className="stats-row" aria-label="Workspace details">
          <div className="stat-pill">
            <strong>{viewerState.user?.name ?? "Creator"}</strong>
            <span>Signed-in owner</span>
          </div>
          <div className="stat-pill">
            <strong>{viewerState.workspace.businessName}</strong>
            <span>Current workspace</span>
          </div>
          <div className="stat-pill">
            <strong>1</strong>
            <span>Workspace per account in this MVP</span>
          </div>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" href="/polls/new">
            Draft a poll
          </Link>
        </div>
      </section>
    </main>
  );
}
