import { render, screen } from "@testing-library/react";
import React from "react";

import Home from "../../pages/index";

describe("index", () => {
  it("should pass", () => {
    render(<Home />);
    const expected = "Rode UI";
    expect(screen.queryByText(expected)).toBeInTheDocument();
  });
});
