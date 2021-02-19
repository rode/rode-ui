import React from "react";
import { render, screen } from "@testing-library/react";
import Resources from "pages/resources";
import { useRouter } from "next/router";
import useSWR from "swr";

jest.mock("next/router");
jest.mock("swr");

describe("Resources", () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      query: {},
    });

    useSWR.mockReturnValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a resource", () => {
    render(<Resources />);

    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });

  describe("search results", () => {
    let resources, expectedSearch;

    beforeEach(() => {
      resources = chance.n(
        () => ({ name: chance.word(), uri: chance.url() }),
        chance.d4()
      );
      expectedSearch = chance.word();
      useRouter.mockReturnValue({
        query: {
          search: expectedSearch,
        },
      });
      useSWR.mockReturnValue({ data: resources });
    });

    it("should pass the search term through as a filter", () => {
      const expectedUri = `/api/resources?filter=${encodeURIComponent(
        expectedSearch
      )}`;

      render(<Resources />);

      expect(useSWR)
        .toHaveBeenCalledTimes(2)
        .toHaveBeenCalledWith(expectedUri, expect.any(Function));
    });

    it("should render all of the search results", () => {
      render(<Resources />);

      resources.forEach((resource) => {
        expect(
          screen.getByText(resource.uri, { exact: false })
        ).toBeInTheDocument();
        expect(
          screen.getByText(resource.name, { exact: false })
        ).toBeInTheDocument();
      });
    });

    it("should render a message when there are no results", () => {
      useSWR.mockReturnValue({ data: [] });

      render(<Resources />);

      expect(screen.getByText("No resources found")).toBeInTheDocument();
    });
  });
});
