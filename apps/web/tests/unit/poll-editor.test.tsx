import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PollEditor } from "@/components/poll-editor";

const mockUseMutation = vi.fn();
const mockUseQuery = vi.fn();
const mockCreatePollDraft = vi.fn();
const mockPublishPoll = vi.fn();
const mockClosePoll = vi.fn();

vi.mock("convex/react", () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
  useQuery: (...args: unknown[]) => mockUseQuery(...args)
}));

vi.mock("@/lib/convex-api", () => ({
  api: {
    polls: {
      listWorkspacePolls: "polls:listWorkspacePolls",
      createPollDraft: "polls:createPollDraft",
      publishPoll: "polls:publishPoll",
      closePoll: "polls:closePoll"
    }
  }
}));

describe("PollEditor", () => {
  beforeEach(() => {
    mockCreatePollDraft.mockReset();
    mockPublishPoll.mockReset();
    mockClosePoll.mockReset();
    mockUseMutation.mockReset();
    mockUseQuery.mockReset();
    mockUseMutation.mockImplementation((reference: string) => {
      if (reference === "polls:createPollDraft") {
        return mockCreatePollDraft;
      }

      if (reference === "polls:publishPoll") {
        return mockPublishPoll;
      }

      if (reference === "polls:closePoll") {
        return mockClosePoll;
      }

      return vi.fn();
    });
    mockUseQuery.mockReturnValue({
      isAuthenticated: true,
      workspace: {
        id: "workspace-1",
        businessName: "Amenline Studio"
      },
      polls: []
    });
  });

  it("requires two options for a choice poll before it is publishable", () => {
    render(<PollEditor />);

    fireEvent.change(screen.getByLabelText(/question/i), {
      target: { value: "Which feature should we build next?" }
    });
    fireEvent.change(screen.getByLabelText(/option 1/i), {
      target: { value: "Analytics dashboard" }
    });

    expect(screen.getByText(/choice polls need at least two options/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/option 2/i), {
      target: { value: "WhatsApp sharing" }
    });

    expect(screen.getByText(/ready to publish/i)).toBeInTheDocument();
  });

  it("allows an open feedback poll without answer options", () => {
    render(<PollEditor />);

    fireEvent.change(screen.getByLabelText(/question/i), {
      target: { value: "What frustrated you most this week?" }
    });
    fireEvent.change(screen.getByLabelText(/poll type/i), {
      target: { value: "open-feedback" }
    });

    expect(screen.getByText(/ready to publish/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/option 1/i)).not.toBeInTheDocument();
  });

  it("saves the draft to Convex and shows confirmation", async () => {
    mockCreatePollDraft.mockResolvedValue({ pollId: "poll-1", slug: "next-feature", status: "draft" });

    render(<PollEditor />);

    fireEvent.change(screen.getByLabelText(/question/i), {
      target: { value: "Which feature should we build next?" }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Help us focus the next sprint." }
    });
    fireEvent.change(screen.getByLabelText(/option 1/i), {
      target: { value: "Analytics dashboard" }
    });
    fireEvent.change(screen.getByLabelText(/option 2/i), {
      target: { value: "WhatsApp sharing" }
    });
    fireEvent.click(screen.getByRole("button", { name: /save draft/i }));

    await waitFor(() => {
      expect(mockCreatePollDraft).toHaveBeenCalledWith({
        title: "Which feature should we build next?",
        description: "Help us focus the next sprint.",
        type: "single-choice",
        options: ["Analytics dashboard", "WhatsApp sharing"]
      });
    });

    expect(screen.getByText(/draft saved in convex as next-feature/i)).toBeInTheDocument();
  });

  it("shows saved drafts from the workspace query", () => {
    mockUseQuery.mockReturnValue({
      isAuthenticated: true,
      workspace: {
        id: "workspace-1",
        businessName: "Amenline Studio"
      },
      polls: [
        {
          id: "poll-1",
          title: "What should we improve next?",
          description: "Help us pick the next iteration.",
          type: "single-choice",
          status: "draft",
          slug: "what-should-we-improve-next",
          createdAt: Date.now(),
          publishedAt: null,
          optionCount: 2
        }
      ]
    });

    render(<PollEditor />);

    expect(screen.getByText(/saved drafts/i)).toBeInTheDocument();
    expect(screen.getByText(/what should we improve next/i)).toBeInTheDocument();
    expect(screen.getByText(/single-choice • draft • 2 options/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "/polls/what-should-we-improve-next" })).toHaveAttribute(
      "href",
      "/polls/what-should-we-improve-next"
    );
  });

  it("publishes a draft poll from the saved drafts list", async () => {
    mockPublishPoll.mockResolvedValue({ pollId: "poll-1", status: "live" });
    mockUseQuery.mockReturnValue({
      isAuthenticated: true,
      workspace: {
        id: "workspace-1",
        businessName: "Amenline Studio"
      },
      polls: [
        {
          id: "poll-1",
          title: "What should we improve next?",
          description: "Help us pick the next iteration.",
          type: "single-choice",
          status: "draft",
          slug: "what-should-we-improve-next",
          createdAt: Date.now(),
          publishedAt: null,
          optionCount: 2
        }
      ]
    });

    render(<PollEditor />);

    fireEvent.click(screen.getByRole("button", { name: /publish poll/i }));

    await waitFor(() => {
      expect(mockPublishPoll).toHaveBeenCalledWith({ pollId: "poll-1" });
    });

    expect(screen.getByText(/poll published/i)).toBeInTheDocument();
  });

  it("closes a live poll from the saved drafts list", async () => {
    mockClosePoll.mockResolvedValue({ pollId: "poll-1", status: "closed" });
    mockUseQuery.mockReturnValue({
      isAuthenticated: true,
      workspace: {
        id: "workspace-1",
        businessName: "Amenline Studio"
      },
      polls: [
        {
          id: "poll-1",
          title: "What should we improve next?",
          description: "Help us pick the next iteration.",
          type: "single-choice",
          status: "live",
          slug: "what-should-we-improve-next",
          createdAt: Date.now(),
          publishedAt: Date.now(),
          optionCount: 2
        }
      ]
    });

    render(<PollEditor />);

    fireEvent.click(screen.getByRole("button", { name: /close poll/i }));

    await waitFor(() => {
      expect(mockClosePoll).toHaveBeenCalledWith({ pollId: "poll-1" });
    });

    expect(screen.getByText(/poll closed/i)).toBeInTheDocument();
  });
});
