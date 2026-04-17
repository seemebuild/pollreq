import React from "react";
import { render, screen } from "@testing-library/react";
import { DashboardShell } from "@/components/dashboard-shell";

const mockUseQuery = vi.fn();

vi.mock("convex/react", () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useMutation: vi.fn()
}));

vi.mock("@/lib/convex-api", () => ({
  api: {
    workspaces: {
      getViewerWorkspace: "workspaces:getViewerWorkspace",
      createWorkspace: "workspaces:createWorkspace"
    }
  }
}));

describe("DashboardShell", () => {
  beforeEach(() => {
    mockUseQuery.mockReset();
  });

  it("shows the onboarding state when the signed-in user has no workspace", () => {
    mockUseQuery.mockReturnValue({
      isAuthenticated: true,
      user: { name: "Aaron", email: "aaron@example.com" },
      workspace: null
    });

    render(<DashboardShell />);

    expect(screen.getByText(/create your workspace before building polls/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create workspace/i })).toBeInTheDocument();
  });

  it("shows the workspace summary when a workspace exists", () => {
    mockUseQuery.mockReturnValue({
      isAuthenticated: true,
      user: { name: "Aaron", email: "aaron@example.com" },
      workspace: {
        id: "workspace-1",
        businessName: "Amenline Studio",
        businessType: "Indie app builder",
        createdAt: Date.now()
      }
    });

    render(<DashboardShell />);

    expect(screen.getByText(/your workspace is ready for the first poll/i)).toBeInTheDocument();
    expect(screen.getByText(/current workspace/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /draft a poll/i })).toBeInTheDocument();
  });
});
