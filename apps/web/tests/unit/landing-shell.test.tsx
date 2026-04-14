import React from "react";
import { render, screen } from "@testing-library/react";
import { LandingShell } from "@/components/landing-shell";

describe("LandingShell", () => {
  it("shows the product positioning and implementation focus", () => {
    render(<LandingShell />);

    expect(
      screen.getByRole("heading", {
        name: /customer feedback for teams that need answers fast/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/delivery rule from the first milestone/i)).toBeInTheDocument();
    expect(screen.getByText(/turbo workspace/i)).toBeInTheDocument();
  });
});
