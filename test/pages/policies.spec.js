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
  let pushMock;
  beforeEach(() => {
    pushMock = jest.fn();
    useRouter.mockReturnValue({
      query: {},
      push: pushMock,
    });

    usePolicies.mockReturnValue({
      dispatch: jest.fn(),
      state: { searchTerm: "" },
    });

    useFetch.mockReturnValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a policy", () => {
    render(<Policies />);

    expect(screen.getByText(/search for a policy/i)).toBeInTheDocument();
  });

  it("should render a button to create a new policy", () => {
    render(<Policies />);

    const renderedNewPolicyButton = screen.getByText(/create new policy/i);
    expect(renderedNewPolicyButton).toBeInTheDocument();

    userEvent.click(renderedNewPolicyButton);

    expect(pushMock)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("/policies/new");
  });

  // TODO: update this with real policy stuff instead of resource things
  describe("search results", () => {
    let policies, expectedSearch;

    beforeEach(() => {
      policies = chance.n(chance.string, chance.d4());
      expectedSearch = chance.word();
      useRouter.mockReturnValue({
        query: {
          search: expectedSearch,
        },
      });
      useFetch.mockReturnValue({ data: policies });
    });

    it("should render a loading indicator when fetching results", () => {
      useFetch.mockReturnValue({ loading: true });
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
      useRouter.mockReturnValue({
        query: {
          search: "all",
        },
      });
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
      useFetch.mockReturnValue({ data: [] });

      render(<Policies />);

      expect(screen.getByText("No policies found")).toBeInTheDocument();
    });
  });
});
