"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { normalizePollDraft, type PollType, validatePublishablePoll } from "@pollreq/shared";
import { api } from "@/lib/convex-api";

const pollTypes: Array<{ value: PollType; label: string; hint: string }> = [
  {
    value: "single-choice",
    label: "Single choice",
    hint: "Let people pick one option."
  },
  {
    value: "multiple-choice",
    label: "Multiple choice",
    hint: "Let people select more than one option."
  },
  {
    value: "rating",
    label: "Rating",
    hint: "Useful for satisfaction and quick sentiment."
  },
  {
    value: "open-feedback",
    label: "Open feedback",
    hint: "Capture direct customer language."
  }
];

type WorkspacePollListItem = {
  id: string;
  title: string;
  description: string | null;
  type: PollType;
  status: "draft" | "live" | "closed";
  slug: string;
  createdAt: number;
  publishedAt: number | null;
  optionCount: number;
};

type WorkspacePollState = {
  isAuthenticated: boolean;
  workspace: {
    id: string;
    businessName: string;
  } | null;
  polls: WorkspacePollListItem[];
};

function getDefaultOptions(type: PollType) {
  return type === "single-choice" || type === "multiple-choice" ? ["", ""] : [];
}

function getPublicPollHref(slug: string) {
  return `/polls/${slug}`;
}

export function PollEditor() {
  const pollState = useQuery(api.polls.listWorkspacePolls) as WorkspacePollState | undefined;
  const createPollDraft = useMutation(api.polls.createPollDraft);
  const publishPoll = useMutation(api.polls.publishPoll);
  const closePoll = useMutation(api.polls.closePoll);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PollType>("single-choice");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePollActionId, setActivePollActionId] = useState<string | null>(null);

  const draft = useMemo(
    () =>
      normalizePollDraft({
        title,
        description,
        type,
        options: options.map((label) => ({ label }))
      }),
    [description, options, title, type]
  );

  const publishStatus = validatePublishablePoll(draft);

  function updateOption(index: number, value: string) {
    setOptions((current) => current.map((option, currentIndex) => (currentIndex === index ? value : option)));
  }

  function addOption() {
    setOptions((current) => [...current, ""]);
  }

  function handleTypeChange(nextType: PollType) {
    setType(nextType);
    setOptions((current) => {
      if (nextType === "single-choice" || nextType === "multiple-choice") {
        return current.length >= 2 ? current : ["", ""];
      }

      return getDefaultOptions(nextType);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await createPollDraft({
        title,
        description: description || undefined,
        type,
        options: type === "single-choice" || type === "multiple-choice" ? options : []
      });

      setSuccessMessage(`Draft saved in Convex as ${result.slug}.`);
      setTitle("");
      setDescription("");
      setType("single-choice");
      setOptions(["", ""]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Poll draft save failed.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePublish(pollId: string) {
    setErrorMessage(null);
    setSuccessMessage(null);
    setActivePollActionId(pollId);

    try {
      await publishPoll({ pollId: pollId as never });
      setSuccessMessage("Poll published. Responses can now be collected once the public page is connected.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Poll publish failed.";
      setErrorMessage(message);
    } finally {
      setActivePollActionId(null);
    }
  }

  async function handleClose(pollId: string) {
    setErrorMessage(null);
    setSuccessMessage(null);
    setActivePollActionId(pollId);

    try {
      await closePoll({ pollId: pollId as never });
      setSuccessMessage("Poll closed. It will stay visible in your workspace as closed.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Poll close failed.";
      setErrorMessage(message);
    } finally {
      setActivePollActionId(null);
    }
  }

  if (pollState === undefined) {
    return (
      <section className="info-card" style={{ maxWidth: 860, margin: "0 auto" }}>
        <p className="section-heading">Draft Poll</p>
        <p style={{ color: "var(--muted)" }}>Loading your workspace poll context from Convex.</p>
      </section>
    );
  }

  if (!pollState.workspace) {
    return (
      <section className="info-card" style={{ maxWidth: 860, margin: "0 auto" }}>
        <p className="section-heading">Draft Poll</p>
        <div className="accent-block">
          <strong>Create a workspace first</strong>
          <span>You need a workspace before PollReq can save drafts and attach them to your business.</span>
        </div>
        <div className="hero-actions" style={{ marginTop: 20 }}>
          <Link className="button button-primary" href="/dashboard">
            Finish workspace setup
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 860, margin: "0 auto" }}>
      <section className="info-card">
        <p className="section-heading">Draft Poll</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label htmlFor="title">
              <strong>Question</strong>
            </label>
            <input
              id="title"
              name="title"
              placeholder="What should we improve next?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              style={inputStyles}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label htmlFor="description">
              <strong>Description</strong>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Add context so customers know what kind of feedback you need."
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              style={inputStyles}
            />
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <label htmlFor="type">
              <strong>Poll type</strong>
            </label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(event) => handleTypeChange(event.target.value as PollType)}
              style={inputStyles}
            >
              {pollTypes.map((pollType) => (
                <option key={pollType.value} value={pollType.value}>
                  {pollType.label}
                </option>
              ))}
            </select>
            <span style={{ color: "var(--muted)" }}>
              {pollTypes.find((pollType) => pollType.value === type)?.hint}
            </span>
          </div>

          {(type === "single-choice" || type === "multiple-choice") && (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>Answer options</strong>
                <button className="button button-secondary" type="button" onClick={addOption}>
                  Add option
                </button>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {options.map((option, index) => (
                  <input
                    key={`option-${index}`}
                    aria-label={`Option ${index + 1}`}
                    value={option}
                    onChange={(event) => updateOption(index, event.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={inputStyles}
                  />
                ))}
              </div>
            </div>
          )}

          {type === "rating" && (
            <div className="accent-block">
              <strong>Rating polls stay lightweight</strong>
              <span>Use a fixed score scale later in the response UI rather than custom options here.</span>
            </div>
          )}

          {type === "open-feedback" && (
            <div className="accent-block">
              <strong>Open feedback is ready for direct comments</strong>
              <span>Customers will answer with free text, so you can keep the draft focused on the question.</span>
            </div>
          )}

          <div className="info-card" style={{ padding: 20, background: "var(--card-strong)" }}>
            <p className="section-heading" style={{ marginBottom: 12 }}>
              Publish Readiness
            </p>
            <strong>{publishStatus.ok ? "Ready to publish" : "Needs attention"}</strong>
            <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
              {publishStatus.ok ? "This draft satisfies the current publish rules." : publishStatus.reason}
            </p>
          </div>

          {errorMessage ? (
            <div className="accent-block" style={errorStyles}>
              <strong>Draft save error</strong>
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {successMessage ? (
            <div className="accent-block">
              <strong>Draft saved</strong>
              <span>{successMessage}</span>
            </div>
          ) : null}

          <div className="hero-actions">
            <button className="button button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Save draft"}
            </button>
          </div>
        </form>
      </section>

      <section className="info-card">
        <p className="section-heading">Saved Drafts</p>
        <p style={{ margin: "0 0 16px", color: "var(--muted)" }}>
          Drafts are stored against {pollState.workspace.businessName} so you can keep iterating without losing work.
        </p>
        {pollState.polls.length === 0 ? (
          <div className="accent-block">
            <strong>No saved drafts yet</strong>
            <span>Your first saved poll will show up here as soon as it lands in Convex.</span>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {pollState.polls.map((poll) => (
              <article
                key={poll.id}
                className="accent-block"
                style={{ display: "grid", gap: 10, background: "rgba(255, 255, 255, 0.72)" }}
              >
                <strong>{poll.title}</strong>
                {poll.description ? <span>{poll.description}</span> : null}
                <span>
                  {poll.type} • {poll.status} • {poll.optionCount} option{poll.optionCount === 1 ? "" : "s"}
                </span>
                <span style={{ color: "var(--muted)" }}>Slug: {poll.slug}</span>
                <div style={{ display: "grid", gap: 6 }}>
                  <span style={{ color: "var(--muted)" }}>Public link</span>
                  <Link href={getPublicPollHref(poll.slug)} style={{ color: "var(--accent)", wordBreak: "break-all" }}>
                    {getPublicPollHref(poll.slug)}
                  </Link>
                </div>
                <div className="hero-actions" style={{ gap: 10 }}>
                  {poll.status === "draft" ? (
                    <button
                      className="button button-primary"
                      type="button"
                      disabled={activePollActionId === poll.id}
                      onClick={() => handlePublish(poll.id)}
                    >
                      {activePollActionId === poll.id ? "Publishing..." : "Publish poll"}
                    </button>
                  ) : null}
                  {poll.status === "live" ? (
                    <button
                      className="button button-secondary"
                      type="button"
                      disabled={activePollActionId === poll.id}
                      onClick={() => handleClose(poll.id)}
                    >
                      {activePollActionId === poll.id ? "Closing..." : "Close poll"}
                    </button>
                  ) : null}
                  {poll.status === "closed" ? (
                    <span style={{ color: "var(--muted)" }}>Closed polls are kept for review history.</span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const inputStyles: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  padding: "14px 16px",
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "rgba(255, 255, 255, 0.7)",
  color: "var(--ink)"
};

const errorStyles: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(240, 127, 60, 0.22), rgba(255, 255, 255, 0.72))"
};
