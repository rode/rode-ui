import React from "react";
import { render, screen } from "@testing-library/react";
import Resources from "../../pages/resources";

describe("Resources", () => {
  it("should render an input for searching for a resource", () => {
    render(<Resources />);

    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });
});
