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
import { act, render, screen } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import PolicyPlayground from "pages/playground";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { useFetch } from "hooks/useFetch";
import {
  createMockEvaluationResult,
  createMockResourceUri,
} from "test/testing-utils/mocks";
import { showError } from "utils/toast-utils";

jest.mock("hooks/useFetch");
jest.mock("hooks/usePaginatedFetch");
jest.mock("utils/toast-utils");

describe("PolicyPlayground", () => {
  let policyState,
    policyDispatch,
    resourceState,
    resourceDispatch,
    fetchResponse,
    usePaginatedFetchResponse,
    fetchOccurrencesResponse,
    evaluationResults;

  beforeEach(() => {
    policyState = {
      searchTerm: chance.string(),
    };
    policyDispatch = jest.fn();
    resourceState = {
      searchTerm: chance.string(),
      versionSearchTerm: chance.string(),
    };
    resourceDispatch = jest.fn();
    evaluationResults = createMockEvaluationResult();
    fetchResponse = {
      json: jest.fn().mockResolvedValue(evaluationResults),
      ok: true,
    };
    usePaginatedFetchResponse = {
      data: [],
      loading: false,
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
    };
    usePaginatedFetch.mockReturnValue(usePaginatedFetchResponse);

    fetchOccurrencesResponse = {
      data: chance.n(chance.string, chance.d4()),
      loading: false,
    };

    useFetch.mockReturnValue(fetchOccurrencesResponse);
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockResolvedValue(fetchResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Empty Evaluation Screen", () => {
    beforeEach(() => {
      render(<PolicyPlayground />, {
        policyState,
        policyDispatch,
        resourceState,
        resourceDispatch,
      });
    });

    it("should clear any search terms set by other searches", () => {
      expect(resourceDispatch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        type: "SET_SEARCH_TERM",
        data: "",
      });
      expect(policyDispatch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        type: "SET_SEARCH_TERM",
        data: "",
      });
    });

    it("should render the title and instructions", () => {
      expect(screen.getByText("Policy Playground")).toBeInTheDocument();
      expect(
        screen.getByText("Choose a resource, pick a policy, and evaluate.")
      ).toBeInTheDocument();
    });

    it("should render a search drawer for resources", () => {
      const resourceName = chance.string();
      const resourceVersion = chance.string();
      usePaginatedFetchResponse.data = [
        {
          uri: createMockResourceUri(resourceName, resourceVersion),
        },
      ];
      usePaginatedFetchResponse.loading = false;

      const resourceResponse = {
        data: [{ uri: createMockResourceUri() }],
        loading: false,
      };

      const versionResponse = {
        data: [{ versionedResourceUri: createMockResourceUri() }],
        loading: false,
      };

      usePaginatedFetch
        .mockReturnValueOnce(resourceResponse)
        .mockReturnValue(versionResponse);

      const openDrawerButton = screen.getByLabelText(/^search for resources/i);

      userEvent.click(openDrawerButton);

      expect(screen.getByTestId("resourceSelectionDrawer")).toHaveClass(
        "openDrawer"
      );

      const renderedResourceSearch = screen.getByLabelText(
        /search for a resource/i
      );
      act(() => {
        userEvent.type(renderedResourceSearch, "{enter}");
      });

      const renderedVersionSearch = screen.getByLabelText(
        /search for a version/i
      );
      act(() => {
        userEvent.type(renderedVersionSearch, "{enter}");
      });
      userEvent.click(screen.getByRole("button", { name: "Select Resource" }));
      expect(policyDispatch).toHaveBeenCalledWith({
        type: "SET_EVALUATION_RESOURCE",
        data: {
          uri: usePaginatedFetchResponse.data[0].uri,
          name: resourceName,
          version: resourceVersion,
          type: "Docker",
        },
      });
    });

    it("should render a search bar for policies", () => {
      const policyName = chance.string();
      const description = chance.string();
      const regoContent = chance.string();
      usePaginatedFetchResponse.data = [
        {
          id: chance.guid(),
          name: policyName,
          description,
          regoContent,
        },
      ];
      usePaginatedFetchResponse.loading = false;
      const renderedSearch = screen.getByLabelText(/search for a policy/i);

      expect(renderedSearch).toBeInTheDocument();
      act(() => {
        userEvent.type(renderedSearch, "{enter}");
      });
      userEvent.click(screen.getByRole("button", { name: "Select Policy" }));
      expect(policyDispatch).toHaveBeenCalledWith({
        type: "SET_EVALUATION_POLICY",
        data: usePaginatedFetchResponse.data[0],
      });
    });

    it("should render the evaluate button as disabled", () => {
      expect(screen.getByRole("button", { name: "Evaluate" })).toBeDisabled();
    });
  });

  describe("Resource and Policy have been selected for evaluation", () => {
    let selectedResource, selectedPolicy, unmount;

    beforeEach(() => {
      selectedResource = {
        versionedResourceUri: chance.string(),
      };
      selectedPolicy = {
        name: chance.string(),
        description: chance.string(),
        regoContent: chance.string(),
      };
      policyState.evaluationResource = selectedResource;
      policyState.evaluationPolicy = selectedPolicy;

      const utils = render(<PolicyPlayground />, {
        policyState: policyState,
        policyDispatch: policyDispatch,
      });

      unmount = utils.unmount;
    });

    it("should render the selected resource occurrence data", () => {
      expect(useFetch).toHaveBeenCalledWith("/api/occurrences", {
        resourceUri: selectedResource.versionedResourceUri,
      });
      expect(screen.getByTestId("occurrenceJson")).toBeInTheDocument();
    });

    it("should render the selected policy details", () => {
      expect(screen.getByTestId("regoPolicyCode")).toBeInTheDocument();
    });

    it("should render the evaluate button as enabled", () => {
      expect(screen.getByRole("button", { name: "Evaluate" })).toBeEnabled();
    });

    describe("Evaluation", () => {
      it("should call to the correct endpoint", async () => {
        fetch.mockClear();
        fetchResponse.json.mockClear();
        const renderedEvaluateButton = screen.getByRole("button", {
          name: "Evaluate",
        });

        await act(async () => {
          await userEvent.click(renderedEvaluateButton);
        });

        expect(fetch)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `/api/policies/${policyState.evaluationPolicy.id}/attest`,
            {
              method: "POST",
              body: JSON.stringify({
                resourceUri:
                  policyState.evaluationResource.versionedResourceUri,
              }),
            }
          );

        expect(fetchResponse.json).toHaveBeenCalledTimes(1);
      });

      it("should show the evaluation results that are returned", async () => {
        const renderedEvaluateButton = screen.getByRole("button", {
          name: "Evaluate",
        });

        await act(async () => {
          await userEvent.click(renderedEvaluateButton);
        });

        expect(
          screen.getByText(/^the resource (?:passed|failed) the policy./i)
        ).toBeInTheDocument();
      });

      it("should show an error if the call to evaluate was not successful", async () => {
        fetchResponse.ok = false;

        const renderedEvaluateButton = screen.getByRole("button", {
          name: "Evaluate",
        });

        await act(async () => {
          await userEvent.click(renderedEvaluateButton);
        });

        expect(
          screen.queryByText(/^the resource (?:passed|failed) the policy./i)
        ).not.toBeInTheDocument();
        expect(showError)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            "An error occurred while evaluating. Please try again."
          );
      });

      it("should clear the selected policy and resource when you leave the playground", () => {
        unmount();
        expect(policyDispatch)
          .toHaveBeenCalledWith({
            type: "SET_EVALUATION_RESOURCE",
            data: null,
          })
          .toHaveBeenCalledWith({
            type: "SET_EVALUATION_POLICY",
            data: null,
          });
      });
    });
  });
});
