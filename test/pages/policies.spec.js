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
import { getResourceDetails } from "utils/resource-utils";
import { useFetch } from "hooks/useFetch";
import { usePolicies } from "providers/policies";
import Policies from "pages/policies";
import userEvent from "@testing-library/user-event";

jest.mock("next/router");
jest.mock("hooks/useFetch");
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
      loading: null,
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

    useFetch.mockReturnValue(mockFetchResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a policy", () => {
    render(<Policies />);

    expect(screen.getByText(/search for a policy/i)).toBeInTheDocument();
  });

  it("should render the policy dashboard buttons", () => {
    render(<Policies />);

    const renderedNewPolicyButton = screen.getByText(/create new policy/i);
    expect(renderedNewPolicyButton).toBeInTheDocument();

    const renderedPlaygroundButton = screen.getByText(/playground/i);
    expect(renderedPlaygroundButton).toBeInTheDocument();
  });

  describe("searching for policies", () => {
    let policies, expectedSearch;

    beforeEach(() => {
      policies = chance.n(chance.string, chance.d4());
      expectedSearch = chance.word();
      mockRouter.query = {
        search: expectedSearch,
      };
      mockFetchResponse.data = policies;
    });

    it("should do nothing if a search term does not exist", () => {
      mockState.searchTerm = " ";

      render(<Policies />);
      const renderedSearchButton = screen.getByTitle(/search/i);
      expect(renderedSearchButton).toBeInTheDocument();

      userEvent.click(renderedSearchButton);
      expect(pushMock).toHaveBeenCalledTimes(0);
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
      render(<Policies />);

      expect(useFetch)
        .toHaveBeenCalledTimes(2)
        .toHaveBeenCalledWith("/api/policies", {
          filter: expectedSearch,
        });
    });

    it("should handle viewing all policies", () => {
      mockRouter.query.search = "all";
      render(<Policies />);

      expect(useFetch)
        .toHaveBeenCalledTimes(2)
        .toHaveBeenCalledWith("/api/policies", null);
    });

    it("should render all of the search results", () => {
      render(<Policies />);

      policies.forEach((policy) => {
        const { policyName } = getResourceDetails(policy.uri);
        expect(
          screen.getAllByText(`Policy Name: ${policyName}`, { exact: false })[0]
        ).toBeInTheDocument();
      });
    });

    it("should render a message when there are no results", () => {
      mockFetchResponse.data = [];

      render(<Policies />);

      expect(screen.getByText("No policies found")).toBeInTheDocument();
    });
  });
});
