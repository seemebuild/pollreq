import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { WorkspaceOnboardingForm } from "@/components/workspace-onboarding-form";

const mockUseMutation = vi.fn();
const mockCreateWorkspace = vi.fn();

vi.mock("convex/react", () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args)
}));

vi.mock("@/lib/convex-api", () => ({
  api: {
    workspaces: {
      createWorkspace: "workspaces:createWorkspace"
    }
  }
}));

describe("WorkspaceOnboardingForm", () => {
  beforeEach(() => {
    mockCreateWorkspace.mockReset();
    mockUseMutation.mockReset();
    mockUseMutation.mockReturnValue(mockCreateWorkspace);
  });

  it("creates a workspace with the entered business details", async () => {
    mockCreateWorkspace.mockResolvedValue({ workspaceId: "workspace-1" });

    render(<WorkspaceOnboardingForm />);

    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: "Amenline Studio" }
    });
    fireEvent.change(screen.getByLabelText(/business type/i), {
      target: { value: "Indie app builder" }
    });
    fireEvent.click(screen.getByRole("button", { name: /create workspace/i }));

    await waitFor(() => {
      expect(mockCreateWorkspace).toHaveBeenCalledWith({
        businessName: "Amenline Studio",
        businessType: "Indie app builder"
      });
    });

    expect(screen.getByText(/workspace created/i)).toBeInTheDocument();
  });

  it("shows the error message when workspace creation fails", async () => {
    mockCreateWorkspace.mockRejectedValue(new Error("A workspace already exists for this account."));

    render(<WorkspaceOnboardingForm />);

    fireEvent.change(screen.getByLabelText(/business name/i), {
      target: { value: "Amenline Studio" }
    });
    fireEvent.click(screen.getByRole("button", { name: /create workspace/i }));

    expect(await screen.findByText(/a workspace already exists for this account/i)).toBeInTheDocument();
  });
});
