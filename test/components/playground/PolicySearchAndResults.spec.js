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
import { useFetch } from "hooks/useFetch";

jest.mock("hooks/useFetch");

describe("PolicySearchAndResults", () => {
  let policy,
    setPolicy,
    clearEvaluation,
    state,
    dispatch,
    fetchResponse,
    fetchedPolicies,
    rerender;

  beforeEach(() => {
    policy = {};
    setPolicy = jest.fn();
    clearEvaluation = jest.fn();
    state = {
      searchTerm: chance.string(),
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
    };

    useFetch.mockReturnValue(fetchResponse);

    const utils = render(
      <PolicySearchAndResults
        policy={policy}
        setPolicy={setPolicy}
        clearEvaluation={clearEvaluation}
      />,
      {
        policyState: state,
        policyDispatch: dispatch,
      }
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the search bar", () => {
    expect(screen.getByText(/search for a policy/i)).toBeInTheDocument();

    const renderedViewAllPoliciesButton = screen.getByRole("button", {
      name: "View all policies",
    });
    expect(renderedViewAllPoliciesButton).toBeInTheDocument();
    userEvent.click(renderedViewAllPoliciesButton);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_SEARCH_TERM",
      data: "all",
    });
  });

  it("should render the loading indicator when searching for a policy", () => {
    fetchResponse.loading = true;
    fetchResponse.data = null;

    searchForPolicy();

    expect(useFetch).toHaveBeenCalledWith("/api/policies", {
      filter: state.searchTerm,
    });
    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render a search result for each policy found", () => {
    fetchResponse.loading = false;
    fetchResponse.data = fetchedPolicies;

    searchForPolicy();

    expect(screen.queryByTestId("loadingIndicator")).not.toBeInTheDocument();
    fetchedPolicies.forEach((policy) => {
      expect(screen.getByText(policy.name)).toBeInTheDocument();
      expect(screen.getByText(policy.description)).toBeInTheDocument();
    });
  });

  it("should select the policy when prompted", () => {
    fetchResponse.loading = false;
    fetchResponse.data = fetchedPolicies;

    searchForPolicy();

    userEvent.click(screen.getAllByText("Select Policy")[0]);
    expect(setPolicy).toHaveBeenCalledWith(fetchedPolicies[0]);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_SEARCH_TERM",
      data: "",
    });
  });

  it("should render a policy as selected if it is the current policy to evaluate", () => {
    fetchResponse.loading = false;
    fetchResponse.data = fetchedPolicies;

    rerender(
      <PolicySearchAndResults
        setPolicy={setPolicy}
        clearEvaluation={clearEvaluation}
        policy={fetchedPolicies[0]}
      />
    );

    searchForPolicy();

    expect(
      screen.getByRole("button", { name: "Selected" })
    ).toBeInTheDocument();
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
  const renderedSearchButton = screen.getByTitle(/search/i);

  act(() => {
    userEvent.type(renderedSearch, chance.string());
  });
  act(() => {
    userEvent.click(renderedSearchButton);
  });
};
