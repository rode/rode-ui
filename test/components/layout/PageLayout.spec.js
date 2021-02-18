import React from "react";
import { render, screen } from "@testing-library/react";

import PageLayout from "components/layout/PageLayout";

describe("PageLayout", () => {
  let children;
  beforeEach(() => {
    children = chance.string();

    render(<PageLayout>{children}</PageLayout>);
  });

  it("should render the header", () => {
    expect(screen.getByTitle(/rode logo/i)).toBeInTheDocument();
  });

  it("should render any children components", () => {
    expect(screen.getByText(children)).toBeInTheDocument();
  });
});
