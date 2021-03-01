import React from "react";
import { render, screen } from "@testing-library/react";
import ResourceBreadcrumbs from "../../../components/resources/ResourceBreadcrumbs";
import { useResources } from "../../../providers/resources";

jest.mock("providers/resources");

describe("ResourceBreadcrumbs", () => {
  let searchTerm;

  beforeEach(() => {
    searchTerm = chance.string();
    useResources.mockReturnValue({
      state: {
        searchTerm,
      },
    });

    render(<ResourceBreadcrumbs />);
  });
  it("should display the Resource Search indicator", () => {
    expect(screen.getByText(/resource search/i)).toBeInTheDocument();
  });

  it("should return a breadcrumb for the search term", () => {
    const renderedSearchTermLink = screen.getByText(searchTerm, {
      exact: false,
    });
    expect(renderedSearchTermLink).toBeInTheDocument();
    expect(renderedSearchTermLink).toHaveAttribute(
      "href",
      `/resources?search=${encodeURIComponent(searchTerm)}`
    );
  });
});
