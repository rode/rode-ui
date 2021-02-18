import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "components/layout/Header";

describe("Header", () => {
  beforeEach(() => {
    render(<Header />);
  });

  it("should render the Rode logo", () => {
    expect(screen.getByTitle(/rode logo/i)).toBeInTheDocument();
  });

  it("should render a link for Resources", () => {
    expect(screen.getByText(/resources/i)).toBeInTheDocument();
  });
});
