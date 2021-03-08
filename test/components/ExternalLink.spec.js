import React from "react";
import { render, screen } from "@testing-library/react";
import ExternalLink from "components/ExternalLink";

describe("ExternalLink", () => {
  let label, href;

  beforeEach(() => {
    label = chance.string();
  });

  it("should return null when no href is present", () => {
    render(<ExternalLink href={null} label={label} />);

    expect(screen.queryByText(label)).not.toBeInTheDocument();
  });

  describe("link exists and should show", () => {
    beforeEach(() => {
      href = chance.url();
      render(<ExternalLink href={href} label={label} />);
    });

    it("should render the link if an href exists", () => {
      const renderedLink = screen.getByText(label);
      expect(renderedLink).toBeInTheDocument();
      expect(renderedLink).toHaveAttribute("href", href);
      expect(renderedLink).toHaveAttribute("target", "_blank");
      expect(renderedLink).toHaveAttribute("rel", "noreferrer");
    });

    it("should render the external link icon", () => {
      expect(screen.getByTitle(/external link/i)).toBeInTheDocument();
    });
  });
});
