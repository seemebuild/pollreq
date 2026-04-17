"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex-api";

type WorkspaceOnboardingFormProps = {
  onCreated?: () => void;
};

export function WorkspaceOnboardingForm({ onCreated }: WorkspaceOnboardingFormProps) {
  const createWorkspace = useMutation(api.workspaces.createWorkspace);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await createWorkspace({
        businessName,
        businessType: businessType || undefined
      });

      setSuccessMessage("Workspace created. Your dashboard is ready.");
      setBusinessName("");
      setBusinessType("");
      onCreated?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Workspace creation failed.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="info-card" style={{ maxWidth: 620, margin: "0 auto" }}>
      <p className="section-heading">Workspace Onboarding</p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label htmlFor="businessName">
            <strong>Business name</strong>
          </label>
          <input
            id="businessName"
            name="businessName"
            placeholder="Amenline Studio"
            style={inputStyles}
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label htmlFor="businessType">
            <strong>Business type</strong>
          </label>
          <input
            id="businessType"
            name="businessType"
            placeholder="Indie app builder, local shop, service business..."
            style={inputStyles}
            value={businessType}
            onChange={(event) => setBusinessType(event.target.value)}
          />
        </div>

        {errorMessage ? (
          <div className="accent-block" style={errorStyles}>
            <strong>Workspace setup error</strong>
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {successMessage ? (
          <div className="accent-block">
            <strong>Workspace ready</strong>
            <span>{successMessage}</span>
          </div>
        ) : null}

        <button className="button button-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating..." : "Create workspace"}
        </button>
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
