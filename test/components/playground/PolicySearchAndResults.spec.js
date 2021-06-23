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
import { render, screen, act } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import PolicySearchAndResults from "components/playground/PolicySearchAndResults";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";

jest.mock("hooks/usePaginatedFetch");

describe("PolicySearchAndResults", () => {
  let setPolicy,
    clearEvaluation,
    state,
    dispatch,
    fetchResponse,
    fetchedPolicies,
    scrollMock,
    rerender;

  beforeEach(() => {
    setPolicy = jest.fn();
    clearEvaluation = jest.fn();
    state = {
      policySearchTerm: chance.string(),
    };
    dispatch = jest.fn();
    fetchedPolicies = chance.n(
      () => ({
        id: chance.guid(),
        name: chance.string(),
        description: chance.sentence(),
      }),
      chance.d4()
    );
    fetchResponse = {
      data: fetchedPolicies,
      loading: false,
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
    };
    scrollMock = jest.fn();
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: scrollMock,
    });

    usePaginatedFetch.mockReturnValue(fetchResponse);

    const utils = render(
      <PolicySearchAndResults
        setPolicy={setPolicy}
        clearEvaluation={clearEvaluation}
      />,
      {
        state,
        dispatch,
      }
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the button to open the search drawer", () => {
    const renderedButton = screen.getByLabelText(/search for policies/i);
    expect(renderedButton).toBeInTheDocument();

    const renderedDrawer = screen.getByTestId("drawer");
    expect(renderedDrawer).toHaveClass("closedDrawer");

    userEvent.click(renderedButton);
    expect(renderedDrawer).toHaveClass("openDrawer");

    userEvent.click(screen.getByLabelText(/close drawer/i));
    expect(renderedDrawer).toHaveClass("closedDrawer");
  });

  it("should render the search bar", () => {
    expect(screen.getByText(/search for a policy/i)).toBeInTheDocument();

    const renderedViewAllPoliciesButton = screen.getByRole("button", {
      name: "View all policies",
    });
    expect(renderedViewAllPoliciesButton).toBeInTheDocument();
    userEvent.click(renderedViewAllPoliciesButton);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_POLICY_SEARCH_TERM",
      data: "all",
    });
  });

  it("should render the loading indicator when searching for a policy", () => {
    fetchResponse.loading = true;
    fetchResponse.data = null;

    searchForPolicy();

    expect(usePaginatedFetch).toHaveBeenCalledWith(
      "/api/policies",
      {
        filter: state.policySearchTerm,
      },
      5
    );
    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render a search result for each policy found", () => {
    searchForPolicy();

    expect(screen.queryByTestId("loadingIndicator")).not.toBeInTheDocument();
    fetchedPolicies.forEach((policy) => {
      expect(screen.getByText(policy.name)).toBeInTheDocument();
      expect(screen.getByText(policy.description)).toBeInTheDocument();
    });
  });

  it("should select the policy when prompted", () => {
    searchForPolicy();

    userEvent.click(screen.getAllByText("Select Policy")[0]);
    expect(setPolicy).toHaveBeenCalledWith(fetchedPolicies[0]);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_POLICY_SEARCH_TERM",
      data: "",
    });
  });

  it("should render a View More button when there are more policies to fetch", () => {
    fetchResponse.isLastPage = false;

    searchForPolicy();

    const renderedShowMoreButton = screen.getByRole("button", {
      name: "See More Policies",
    });

    expect(renderedShowMoreButton).toBeInTheDocument();
    userEvent.click(renderedShowMoreButton);
    expect(fetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
  });

  it("should render the no policies found message if no policies were found", () => {
    fetchResponse.loading = false;
    fetchResponse.data = [];

    rerender(
      <PolicySearchAndResults
        setPolicy={setPolicy}
        clearEvaluation={clearEvaluation}
      />
    );
    searchForPolicy();

    expect(screen.getByText(/no policies found/i)).toBeInTheDocument();
  });
});

const searchForPolicy = () => {
  const renderedSearch = screen.getByText(/search for a policy/i);
  const renderedSearchButton = screen.getByLabelText(/search policies/i);

  act(() => {
    userEvent.type(renderedSearch, chance.string());
  });
  act(() => {
    userEvent.click(renderedSearchButton);
  });
};
