import React, { useMemo, useState } from "react";
import { normalizePollDraft, type PollType, validatePublishablePoll } from "@pollreq/shared";

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

function getDefaultOptions(type: PollType) {
  return type === "single-choice" || type === "multiple-choice" ? ["", ""] : [];
}

export function PollEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PollType>("single-choice");
  const [options, setOptions] = useState<string[]>(["", ""]);

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

  return (
    <section className="info-card" style={{ maxWidth: 860, margin: "0 auto" }}>
      <p className="section-heading">Draft Poll</p>
      <div style={{ display: "grid", gap: 20 }}>
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
      </div>
    </section>
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
