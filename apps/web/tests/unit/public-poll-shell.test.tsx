import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { PublicPollShell } from "@/components/public-poll-shell";

const mockUseQuery = vi.fn();

vi.mock("convex/react", () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args)
}));

vi.mock("@/lib/convex-api", () => ({
  api: {
    polls: {
      getPublicPollBySlug: "polls:getPublicPollBySlug"
    }
  }
}));

describe("PublicPollShell", () => {
  beforeEach(() => {
    mockUseQuery.mockReset();
  });

  it("shows a live single-choice poll with options", () => {
    mockUseQuery.mockReturnValue({
      state: "live",
      poll: {
        id: "poll-1",
        title: "Which improvement matters most?",
        description: "Help us pick the next update.",
        type: "single-choice",
        slug: "which-improvement-matters-most",
        status: "live",
        options: [
          { id: "option-1", label: "Faster checkout", position: 0 },
          { id: "option-2", label: "Analytics dashboard", position: 1 }
        ]
      }
    });

    render(<PublicPollShell slug="which-improvement-matters-most" />);

    expect(screen.getByText(/which improvement matters most/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/faster checkout/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/analytics dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit response/i })).toBeDisabled();
  });

  it("shows the not-found state for an unknown slug", () => {
    mockUseQuery.mockReturnValue({
      state: "not-found",
      poll: null
    });

    render(<PublicPollShell slug="missing-poll" />);

    expect(screen.getByText(/we couldn't find that poll/i)).toBeInTheDocument();
  });

  it("lets a visitor select a rating option", () => {
    mockUseQuery.mockReturnValue({
      state: "live",
      poll: {
        id: "poll-2",
        title: "How satisfied are you?",
        description: null,
        type: "rating",
        slug: "how-satisfied-are-you",
        status: "live",
        options: []
      }
    });

    render(<PublicPollShell slug="how-satisfied-are-you" />);

    fireEvent.click(screen.getByRole("button", { name: "4" }));

    expect(screen.getByRole("button", { name: "4" })).toHaveClass("button-primary");
  });
});
