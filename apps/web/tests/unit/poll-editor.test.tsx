import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { PollEditor } from "@/components/poll-editor";

describe("PollEditor", () => {
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
});
