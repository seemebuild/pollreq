import { describe, expect, it } from "vitest";
import { normalizePollDraft, validatePublishablePoll } from "./polls";

describe("normalizePollDraft", () => {
  it("trims title, description, and empty choice options", () => {
    const draft = normalizePollDraft({
      title: "  Favorite feature?  ",
      description: "  Help us decide what to build next. ",
      type: "single-choice",
      options: [{ label: " Search " }, { label: " " }, { label: " Analytics" }]
    });

    expect(draft).toEqual({
      title: "Favorite feature?",
      description: "Help us decide what to build next.",
      type: "single-choice",
      options: [{ label: "Search" }, { label: "Analytics" }],
      status: "draft"
    });
  });
});

describe("validatePublishablePoll", () => {
  it("rejects a choice poll that does not have enough options", () => {
    const result = validatePublishablePoll(
      normalizePollDraft({
        title: "What should we launch next?",
        type: "single-choice",
        options: [{ label: "Mobile app" }]
      })
    );

    expect(result).toEqual({
      ok: false,
      reason: "Choice polls need at least two options before publishing."
    });
  });

  it("accepts an open feedback poll without choice options", () => {
    const result = validatePublishablePoll(
      normalizePollDraft({
        title: "What frustrated you most this week?",
        type: "open-feedback"
      })
    );

    expect(result).toEqual({ ok: true });
  });
});
