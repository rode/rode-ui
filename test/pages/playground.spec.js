import React from "react";
import { act, render, screen } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import PolicyEvaluationPlayground from "pages/playground";
import { useFetch } from "hooks/useFetch";
import { createMockResourceUri } from "test/testing-utils/mocks";

jest.mock("hooks/useFetch");

describe("PolicyEvaluationPlayground", () => {
  let policyState,
    policyDispatch,
    resourceState,
    fetchResponse,
    useFetchResponse,
    evaluationResults,
    rerender;

  beforeEach(() => {
    policyState = {
      searchTerm: chance.string()
    };
    policyDispatch = jest.fn();
    resourceState = {
      searchTerm: chance.string()
    };
    evaluationResults = {
      pass: chance.bool(),
      explanation: chance.string(),
    };
    fetchResponse = {
      json: jest.fn().mockResolvedValue(evaluationResults),
      ok: true,
    };
    useFetchResponse = {
      data: null,
      loading: null,
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
      const utils = render(<PolicyEvaluationPlayground />, {
        policyState,
        policyDispatch,
        resourceState
      });

      rerender = utils.rerender;
    });

    it("should render the title and instructions", () => {
      expect(
        screen.getByText("Policy Evaluation Playground")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Choose a resource, pick a policy, and evaluate.")
      ).toBeInTheDocument();
    });

    it("should render a search bar for resources", () => {
      const resourceName = chance.string();
      const resourceVersion = chance.string();
      useFetchResponse.data = [ {
        uri: createMockResourceUri(resourceName, resourceVersion),
      }];
      useFetchResponse.loading = false;

      const renderedSearch = screen.getByLabelText(/search for a resource/i);

      expect(renderedSearch).toBeInTheDocument();
      act(() => {
        userEvent.type(renderedSearch, "{enter}");
      });
      userEvent.click(screen.getByRole("button", {name: "Select Resource"}));
      expect(policyDispatch).toHaveBeenCalledWith({
        type: "SET_EVALUATION_RESOURCE",
        data: {
          uri: useFetchResponse.data[0].uri,
          name: resourceName,
          version: resourceVersion
        },
      });
    });

    it("should render a search bar for policies", () => {
      const policyName = chance.string();
      const description = chance.string();
      const regoContent = chance.string()
      useFetchResponse.data = [ {
        id: chance.guid(),
        name: policyName,
        description,
        regoContent
      }];
      useFetchResponse.loading = false;
      const renderedSearch = screen.getByLabelText(/search for a policy/i);

      expect(renderedSearch).toBeInTheDocument();
      act(() => {
        userEvent.type(renderedSearch, "{enter}");
      });
      userEvent.click(screen.getByRole("button", {name: "Select Policy"}));
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
    let selectedResource, selectedPolicy;
    beforeEach(() => {
      selectedResource = {
        uri: chance.string(),
        name: chance.string(),
        version: chance.string(),
      };
      selectedPolicy = {
        name: chance.string(),
        description: chance.string(),
        regoContent: chance.string(),
      };
      policyState.evaluationResource = selectedResource;
      policyState.evaluationPolicy = selectedPolicy;
      render(<PolicyEvaluationPlayground />, {
        policyState: policyState,
        policyDispatch: policyDispatch,
      });
    });

    it("should render the selected resource details", () => {
      expect(screen.getByText(selectedResource.name)).toBeInTheDocument();
      expect(screen.getByText(selectedResource.version)).toBeInTheDocument();

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
  });

  describe("Evaluation", () => {
    it("should call to the correct endpoint", () => {
      // TODO: finish these tests out
    });

    it("should show the evaluation results that are returned", () => {

    });

    it("should show an error if the call to evaluate was not successful", () => {

    });
  });
});
