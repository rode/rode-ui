/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { usePolicies } from "providers/policies";
import Policies from "pages/policies";
import userEvent from "@testing-library/user-event";

jest.mock("next/router");
jest.mock("hooks/usePaginatedFetch");
jest.mock("providers/policies");

describe("Policies", () => {
  let pushMock, mockRouter, mockState, mockDispatch, mockFetchResponse;
  beforeEach(() => {
    pushMock = jest.fn();
    mockDispatch = jest.fn();
    mockState = {
      searchTerm: "",
    };
    mockFetchResponse = {
      data: null,
      loading: chance.bool(),
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
    };
    mockRouter = {
      query: {},
      push: pushMock,
    };
    useRouter.mockReturnValue(mockRouter);

    usePolicies.mockReturnValue({
      dispatch: mockDispatch,
      state: mockState,
    });

    usePaginatedFetch.mockReturnValue(mockFetchResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a policy", () => {
    render(<Policies />);

    expect(screen.getByText(/search for a policy/i)).toBeInTheDocument();
  });

  describe("searching for policies", () => {
    let policies, expectedSearch;

    beforeEach(() => {
      policies = chance.n(
        () => ({
          name: chance.string(),
          description: chance.string(),
          id: chance.guid(),
        }),
        chance.d4()
      );
      expectedSearch = chance.word();
      mockRouter.query = {
        search: expectedSearch,
      };
      mockFetchResponse.data = policies;
      mockFetchResponse.loading = false;
    });

    it("should search for all policies if a search term does not exist", () => {
      mockState.searchTerm = " ";

      render(<Policies />);
      const renderedSearchButton = screen.getByTitle(/search/i);
      expect(renderedSearchButton).toBeInTheDocument();

      userEvent.click(renderedSearchButton);
      expect(pushMock)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies?search=all`);
    });

    it("should kick off the search when the search button is pressed and a search term exists", () => {
      mockState.searchTerm = expectedSearch;

      render(<Policies />);
      const renderedSearchButton = screen.getByTitle(/search/i);
      expect(renderedSearchButton).toBeInTheDocument();

      userEvent.click(renderedSearchButton);
      expect(pushMock)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies?search=${expectedSearch}`);
    });

    it("should render a loading indicator when fetching results", () => {
      mockFetchResponse.loading = true;
      render(<Policies />);

      expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    });

    it("should pass the search term through as a filter", () => {
      mockState.searchTerm = expectedSearch;
      render(<Policies />);

      expect(usePaginatedFetch).toHaveBeenCalledTimes(2).toHaveBeenCalledWith(
        "/api/policies",
        {
          filter: expectedSearch,
        },
        10
      );
    });

    it("should handle viewing all policies", () => {
      mockState.searchTerm = "all";
      render(<Policies />);

      expect(usePaginatedFetch)
        .toHaveBeenCalledTimes(2)
        .toHaveBeenCalledWith("/api/policies", null, 10);
    });

    it("should render all of the returned search results", () => {
      render(<Policies />);

      policies.forEach((policy, index) => {
        const { name } = policy;
        expect(screen.getAllByText("Policy Name")[index]).toBeInTheDocument();
        expect(screen.getAllByText(name)[0]).toBeInTheDocument();
      });
    });

    it("should render a button to view more results if the user is not at the end of the found results", () => {
      mockFetchResponse.isLastPage = false;
      render(<Policies />);

      const viewMoreButton = screen.getByRole("button", { name: "View More" });
      expect(viewMoreButton).toBeInTheDocument();
      userEvent.click(viewMoreButton);
      expect(mockFetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
    });

    it("should render a message when there are no results", () => {
      mockFetchResponse.data = [];

      render(<Policies />);

      expect(screen.getByText("No policies found")).toBeInTheDocument();
    });
  });
});
