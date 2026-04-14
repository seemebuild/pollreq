export type PollType = "single-choice" | "multiple-choice" | "rating" | "open-feedback";
export type PollStatus = "draft" | "live" | "closed";

export type PollOptionInput = {
  label: string;
};

export type CreatePollDraftInput = {
  title: string;
  description?: string;
  type: PollType;
  options?: PollOptionInput[];
};

export type NormalizedPollDraft = {
  title: string;
  description?: string;
  type: PollType;
  options: PollOptionInput[];
  status: PollStatus;
};

const choicePollTypes = new Set<PollType>(["single-choice", "multiple-choice"]);

export function isChoicePoll(type: PollType) {
  return choicePollTypes.has(type);
}

export function normalizePollDraft(input: CreatePollDraftInput): NormalizedPollDraft {
  const title = input.title.trim();
  const description = input.description?.trim();
  const options = (input.options ?? [])
    .map((option) => option.label.trim())
    .filter(Boolean)
    .map((label) => ({ label }));

  return {
    title,
    description: description || undefined,
    type: input.type,
    options,
    status: "draft"
  };
}

export function validatePublishablePoll(draft: NormalizedPollDraft) {
  if (!draft.title) {
    return {
      ok: false,
      reason: "A poll title is required before publishing."
    } as const;
  }

  if (isChoicePoll(draft.type) && draft.options.length < 2) {
    return {
      ok: false,
      reason: "Choice polls need at least two options before publishing."
    } as const;
  }

  if (draft.type === "rating" && draft.options.length > 0) {
    return {
      ok: false,
      reason: "Rating polls should not store manual answer options."
    } as const;
  }

  return {
    ok: true
  } as const;
}
