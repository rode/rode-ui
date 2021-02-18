import React from "react";
import { render, screen } from "@testing-library/react";
import Resources from "pages/resources";
import { useRouter } from "next/router";

jest.mock("next/router");

describe("Resources", () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      query: {},
    });
  });

  it("should render an input for searching for a resource", () => {
    render(<Resources />);

    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });
});
