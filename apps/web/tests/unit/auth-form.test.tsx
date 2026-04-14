import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthForm } from "@/components/auth-form";

const { mockSignInEmail, mockSignUpEmail } = vi.hoisted(() => ({
  mockSignInEmail: vi.fn(),
  mockSignUpEmail: vi.fn()
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: mockSignInEmail
    },
    signUp: {
      email: mockSignUpEmail
    }
  }
}));

describe("AuthForm", () => {
  beforeEach(() => {
    mockSignInEmail.mockReset();
    mockSignUpEmail.mockReset();
  });

  it("submits sign-in requests with the dashboard callback", async () => {
    mockSignInEmail.mockResolvedValue({ data: { ok: true }, error: null });

    render(<AuthForm mode="sign-in" />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "founder@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secure-pass-123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignInEmail).toHaveBeenCalledWith({
        email: "founder@example.com",
        password: "secure-pass-123",
        callbackURL: "/dashboard"
      });
    });

    expect(screen.getByText(/sign-in request accepted/i)).toBeInTheDocument();
  });

  it("submits sign-up requests with name, email, and password", async () => {
    mockSignUpEmail.mockResolvedValue({ data: { ok: true }, error: null });

    render(<AuthForm mode="sign-up" />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Alicia Mensah" }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "alicia@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secure-pass-123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockSignUpEmail).toHaveBeenCalledWith({
        name: "Alicia Mensah",
        email: "alicia@example.com",
        password: "secure-pass-123",
        callbackURL: "/dashboard"
      });
    });
  });

  it("shows the auth error message when the request fails", async () => {
    mockSignInEmail.mockResolvedValue({
      data: null,
      error: { message: "Invalid email or password" }
    });

    render(<AuthForm mode="sign-in" />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "founder@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong-password" }
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
