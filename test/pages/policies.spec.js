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
import { render, screen } from "test/testing-utils/renderer";
import { useRouter } from "next/router";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Policies from "pages/policies";
import userEvent from "@testing-library/user-event";

jest.mock("next/router");
jest.mock("hooks/usePaginatedFetch");

describe("Policies", () => {
  let policies,
    expectedSearch,
    pushMock,
    mockRouter,
    state,
    dispatch,
    mockFetchResponse,
    blurTrigger,
    rerender;

  beforeEach(() => {
    pushMock = jest.fn();
    dispatch = jest.fn();
    state = {
      policySearchTerm: "",
    };
    blurTrigger = chance.string({ alpha: true });
    policies = chance.n(
      () => ({
        name: chance.string(),
        description: chance.string(),
        id: chance.guid(),
      }),
      chance.d4()
    );
    expectedSearch = chance.word();
    mockFetchResponse = {
      data: policies,
      loading: false,
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
    };
    mockRouter = {
      query: {
        search: expectedSearch,
      },
      push: pushMock,
    };
    useRouter.mockReturnValue(mockRouter);

    usePaginatedFetch.mockReturnValue(mockFetchResponse);
    const utils = render(<Policies />, { state, dispatch });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a policy", () => {
    expect(screen.getByText(/search for a policy/i)).toBeInTheDocument();
  });

  it("should clear the search term if it doesn't exist in the url", () => {
    mockRouter.query.search = "";
    rerender(<Policies />);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_POLICY_SEARCH_TERM",
      data: "",
    });
  });

  it("should save the search term specified in the url", () => {
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_POLICY_SEARCH_TERM",
      data: expectedSearch,
    });
  });

  describe("searching for policies", () => {
    it("should search for all policies if a search term does not exist", () => {
      state.policySearchTerm = "";

      rerender(<Policies />);
      const renderedSearchButton = screen.getByTitle(/search/i);
      expect(renderedSearchButton).toBeInTheDocument();

      userEvent.click(renderedSearchButton);
      expect(pushMock)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies?search=all`);
    });

    describe("searching for a specific term", () => {
      beforeEach(() => {
        state.policySearchTerm = expectedSearch;
        rerender(<Policies />);
      });

      it("should kick off the search when the search button is pressed and a search term exists", () => {
        const renderedSearchButton = screen.getByTitle(/search/i);
        expect(renderedSearchButton).toBeInTheDocument();

        userEvent.click(renderedSearchButton);
        expect(pushMock)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`/policies?search=${expectedSearch}`);
      });

      it("should kick off the search when the user navigates away from the search bar", () => {
        rerender(
          <>
            <p>{blurTrigger}</p>
            <Policies />
          </>
        );
        const renderedInput = screen.getByLabelText(/^search for a policy$/i);
        userEvent.click(renderedInput);
        userEvent.click(screen.getByText(blurTrigger));
        expect(pushMock)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`/policies?search=${expectedSearch}`);
      });

      it("should pass the search term through as a filter", () => {
        expect(usePaginatedFetch).toHaveBeenLastCalledWith(
          "/api/policies",
          {
            filter: expectedSearch,
          },
          10
        );
      });
    });

    it("should render a loading indicator when fetching results", () => {
      mockFetchResponse.loading = true;
      rerender(<Policies />);

      expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    });

    it("should render all of the returned search results", () => {
      policies.forEach((policy, index) => {
        const { name } = policy;
        expect(screen.getAllByText("Policy Name")[index]).toBeInTheDocument();
        expect(screen.getAllByText(name)[0]).toBeInTheDocument();
      });
    });

    it("should handle viewing all policies", () => {
      state.policySearchTerm = "all";
      rerender(<Policies />);

      expect(usePaginatedFetch).toHaveBeenLastCalledWith(
        "/api/policies",
        null,
        10
      );
    });

    it("should render a button to view more results if the user is not at the end of the found results", () => {
      mockFetchResponse.isLastPage = false;
      rerender(<Policies />);

      const viewMoreButton = screen.getByRole("button", { name: "View More" });
      expect(viewMoreButton).toBeInTheDocument();
      userEvent.click(viewMoreButton);
      expect(mockFetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
    });

    it("should render a message when there are no results", () => {
      mockFetchResponse.data = [];

      rerender(<Policies />);

      expect(screen.getByText("No policies found")).toBeInTheDocument();
    });
  });
});
