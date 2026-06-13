"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";

type PublicPollShellProps = {
  slug: string;
};

type PublicPollState =
  | {
      state: "not-found";
      poll: null;
    }
  | {
      state: "closed" | "not-live";
      poll: {
        id: string;
        title: string;
        description: string | null;
        type: "single-choice" | "multiple-choice" | "rating" | "open-feedback";
        slug: string;
        status: "draft" | "live" | "closed";
      };
    }
  | {
      state: "live";
      poll: {
        id: string;
        title: string;
        description: string | null;
        type: "single-choice" | "multiple-choice" | "rating" | "open-feedback";
        slug: string;
        status: "live";
        options: Array<{
          id: string;
          label: string;
          position: number;
        }>;
      };
    };

type LivePublicPoll = Extract<PublicPollState, { state: "live" }>["poll"];

export function PublicPollShell({ slug }: PublicPollShellProps) {
  const pollState = useQuery(api.polls.getPublicPollBySlug, { slug }) as PublicPollState | undefined;
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  if (pollState === undefined) {
    return (
      <section className="hero-card" style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="eyebrow">
          <span>Customer Poll</span>
          <span>Loading</span>
        </div>
        <h1 className="hero-title" style={{ maxWidth: "10ch", fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
          Preparing this feedback prompt.
        </h1>
      </section>
    );
  }

  if (pollState.state === "not-found") {
    return (
      <section className="hero-card" style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="eyebrow">
          <span>Customer Poll</span>
          <span>Unavailable</span>
        </div>
        <h1 className="hero-title" style={{ maxWidth: "10ch", fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
          We couldn&apos;t find that poll.
        </h1>
        <p className="hero-copy">The link may be wrong, expired, or the poll has not been published yet.</p>
      </section>
    );
  }

  if (pollState.state === "closed") {
    return (
      <section className="hero-card" style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="eyebrow">
          <span>Customer Poll</span>
          <span>Closed</span>
        </div>
        <h1 className="hero-title" style={{ maxWidth: "12ch", fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
          This poll is no longer accepting responses.
        </h1>
        <p className="hero-copy">{pollState.poll.title}</p>
      </section>
    );
  }

  if (pollState.state === "not-live") {
    return (
      <section className="hero-card" style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="eyebrow">
          <span>Customer Poll</span>
          <span>Not live</span>
        </div>
        <h1 className="hero-title" style={{ maxWidth: "12ch", fontSize: "clamp(2.6rem, 7vw, 4.8rem)" }}>
          This poll is not published yet.
        </h1>
        <p className="hero-copy">{pollState.poll.title}</p>
      </section>
    );
  }

  const livePoll = pollState.poll as LivePublicPoll;

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 820, margin: "0 auto" }}>
      <section className="hero-card">
        <div className="eyebrow">
          <span>Customer Poll</span>
          <span>{livePoll.type}</span>
        </div>
        <h1 className="hero-title" style={{ maxWidth: "14ch", fontSize: "clamp(2.3rem, 6vw, 4.2rem)" }}>
          {livePoll.title}
        </h1>
        {livePoll.description ? <p className="hero-copy">{livePoll.description}</p> : null}
      </section>

      <section className="info-card">
        <p className="section-heading">Your Response</p>
        <div style={{ display: "grid", gap: 16 }}>
          {(livePoll.type === "single-choice" || livePoll.type === "multiple-choice") && (
            <div style={{ display: "grid", gap: 12 }}>
              {livePoll.options.map((option) => {
                const checked =
                  livePoll.type === "single-choice"
                    ? selectedOption === option.id
                    : selectedOptions.includes(option.id);

                return (
                  <label
                    key={option.id}
                    className="accent-block"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: 18 }}
                  >
                    <input
                      type={livePoll.type === "single-choice" ? "radio" : "checkbox"}
                      name="poll-response"
                      checked={checked}
                      onChange={() => {
                        if (livePoll.type === "single-choice") {
                          setSelectedOption(option.id);
                          return;
                        }

                        setSelectedOptions((current) =>
                          current.includes(option.id)
                            ? current.filter((value) => value !== option.id)
                            : [...current, option.id]
                        );
                      }}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          )}

          {livePoll.type === "rating" && (
            <div style={{ display: "grid", gap: 12 }}>
              <span style={{ color: "var(--muted)" }}>Choose a score from 1 to 5.</span>
              <div className="hero-actions">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={value === ratingValue ? "button button-primary" : "button button-secondary"}
                    onClick={() => setRatingValue(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {livePoll.type === "open-feedback" && (
            <textarea
              aria-label="Your feedback"
              placeholder="Share your thoughts here..."
              rows={6}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              style={inputStyles}
            />
          )}

          <div className="accent-block">
            <strong>Submission is the next slice</strong>
            <span>This public response UI is now live. The next implementation step will store responses in Convex.</span>
          </div>

          <button className="button button-primary" disabled type="button">
            Submit response
          </button>
        </div>
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
