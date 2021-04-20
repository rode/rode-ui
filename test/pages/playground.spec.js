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
import { useFetch } from "hooks/useFetch";
import {
  createMockEvaluationResult,
  createMockResourceUri,
} from "test/testing-utils/mocks";
import { showError } from "utils/toast-utils";

jest.mock("hooks/useFetch");
jest.mock("utils/toast-utils");

describe("PolicyPlayground", () => {
  let policyState,
    policyDispatch,
    resourceState,
    resourceDispatch,
    fetchResponse,
    useFetchResponse,
    evaluationResults;

  beforeEach(() => {
    policyState = {
      searchTerm: chance.string(),
    };
    policyDispatch = jest.fn();
    resourceState = {
      searchTerm: chance.string(),
    };
    resourceDispatch = jest.fn();
    evaluationResults = createMockEvaluationResult();
    fetchResponse = {
      json: jest.fn().mockResolvedValue(evaluationResults),
      ok: true,
    };
    useFetchResponse = {
      data: [],
      loading: false,
    };
    useFetch.mockReturnValue(useFetchResponse);
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

    it("should render a search bar for resources", () => {
      const resourceName = chance.string();
      const resourceVersion = chance.string();
      useFetchResponse.data = [
        {
          uri: createMockResourceUri(resourceName, resourceVersion),
        },
      ];
      useFetchResponse.loading = false;

      const renderedSearch = screen.getByLabelText(/search for a resource/i);

      expect(renderedSearch).toBeInTheDocument();
      act(() => {
        userEvent.type(renderedSearch, "{enter}");
      });
      userEvent.click(screen.getByRole("button", { name: "Select Resource" }));
      expect(policyDispatch).toHaveBeenCalledWith({
        type: "SET_EVALUATION_RESOURCE",
        data: {
          uri: useFetchResponse.data[0].uri,
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
      useFetchResponse.data = [
        {
          id: chance.guid(),
          name: policyName,
          description,
          regoContent,
        },
      ];
      useFetchResponse.loading = false;
      const renderedSearch = screen.getByLabelText(/search for a policy/i);

      expect(renderedSearch).toBeInTheDocument();
      act(() => {
        userEvent.type(renderedSearch, "{enter}");
      });
      userEvent.click(screen.getByRole("button", { name: "Select Policy" }));
      expect(policyDispatch).toHaveBeenCalledWith({
        type: "SET_EVALUATION_POLICY",
        data: useFetchResponse.data[0],
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
        uri: chance.string(),
        name: chance.string(),
        version: chance.string(),
        type: chance.string(),
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

    it("should render the selected resource details", () => {
      expect(screen.getByText(selectedResource.name)).toBeInTheDocument();
      expect(screen.getByText(selectedResource.version)).toBeInTheDocument();
      expect(screen.getByText(selectedResource.type)).toBeInTheDocument();

      const renderedClearResourceButton = screen.getByRole("button", {
        name: "Clear Resource",
      });
      expect(renderedClearResourceButton).toBeInTheDocument();
      userEvent.click(renderedClearResourceButton);
      expect(policyDispatch).toHaveBeenCalledWith({
        type: "SET_EVALUATION_RESOURCE",
        data: null,
      });
    });

    it("should render the selected policy details", () => {
      expect(screen.getByText(selectedPolicy.name)).toBeInTheDocument();
      expect(screen.getByText(selectedPolicy.description)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(selectedPolicy.regoContent)
      ).toBeInTheDocument();

      const renderedClearPolicyButton = screen.getByRole("button", {
        name: "Clear Policy",
      });
      expect(renderedClearPolicyButton).toBeInTheDocument();
      userEvent.click(renderedClearPolicyButton);
      expect(policyDispatch).toHaveBeenCalledWith({
        type: "SET_EVALUATION_POLICY",
        data: null,
      });
    });

    it("should render the evaluate button as enabled", () => {
      expect(screen.getByRole("button", { name: "Evaluate" })).toBeEnabled();
    });

    describe("Evaluation", () => {
      it("should call to the correct endpoint", async () => {
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
                resourceUri: policyState.evaluationResource.uri,
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

      it("should clear the playground when the Reset Playground button is pressed", async () => {
        const renderedEvaluateButton = screen.getByRole("button", {
          name: "Evaluate",
        });

        await act(async () => {
          await userEvent.click(renderedEvaluateButton);
        });

        expect(
          screen.getByText(/^the resource (?:passed|failed) the policy./i)
        ).toBeInTheDocument();

        const resetPlaygroundButton = screen.getByRole("button", {
          name: "Reset Playground",
        });

        expect(resetPlaygroundButton).toBeInTheDocument();
        act(() => {
          userEvent.click(resetPlaygroundButton);
        });

        expect(
          screen.queryByText(/^the resource (?:passed|failed) the policy./i)
        ).not.toBeInTheDocument();
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
