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
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { usePolicy } from "hooks/usePolicy";
import Policy from "pages/policies/[id]";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { useFetch } from "hooks/useFetch";

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/usePolicy");
jest.mock("hooks/usePaginatedFetch");
jest.mock("hooks/useFetch");

describe("Policy Details", () => {
  let router,
    policy,
    mockUsePolicy,
    policyVersions,
    assignments,
    mockPaginatedFetch,
    mockFetch,
    rerender,
    dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    router = {
      query: {
        id: chance.guid(),
      },
      push: jest.fn(),
      asPath: chance.string({ alpha: true }),
    };
    policy = {
      id: router.query.id,
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.word({ syllables: 4 }),
      policyVersion: chance.d10(),
      currentVersion: chance.d10()
    };

    mockUsePolicy = {
      policy,
      loading: false,
    };

    policyVersions = chance.n(
      () => ({
        version: chance.d100(),
        message: chance.string(),
        created: chance.timestamp(),
      }),
      chance.d4()
    );

    assignments = chance.n(
      () => ({
        id: chance.guid(),
        policyGroup: chance.string(),
        policyVersionId: `${chance.guid()}.${chance.d10()}`,
      }),
      chance.d4()
    );
    usePolicy.mockReturnValue(mockUsePolicy);
    useRouter.mockReturnValue(router);
    mockPaginatedFetch = {
      data: policyVersions,
      loading: false,
      isLastPage: false,
      goToNextPage: jest.fn(),
    };
    mockFetch = {
      data: {
        policyAssignments: assignments,
      },
      loading: false,
    };
    usePaginatedFetch.mockReturnValue(mockPaginatedFetch);
    useFetch.mockReturnValue(mockFetch);
    const utils = render(<Policy />, {
      state: { policySearchTerm: "test search term" },
      dispatch: dispatch,
    });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("fetching the policy", () => {
    it("should call to get the policy", () => {
      expect(usePolicy).toHaveBeenLastCalledWith(router.query.id);
    });

    it("should render the loading indicator", () => {
      mockUsePolicy.loading = true;

      rerender(<Policy />);
      expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    });
  });

  describe("policy has been found", () => {
    it("should render the policy header", () => {
      expect(screen.getByText(policy.name, {exact: false})).toBeInTheDocument();
      expect(screen.getByText(policy.description)).toBeInTheDocument();
      expect(screen.getByText(`v${policy.policyVersion}`, {exact: false})).toBeInTheDocument();
      expect(screen.getByText(`Latest Version ${policy.currentVersion}`)).toBeInTheDocument();

      const renderedButton = screen.getByText("Edit Policy");
      expect(renderedButton).toBeInTheDocument();
      userEvent.click(renderedButton);

      expect(router.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies/${policy.id}/edit`);
    });

    it("should render a button to evaluate the policy in the playground", () => {
      const renderedButton = screen.getByRole("button", {
        name: "Evaluate in Policy Playground",
      });

      expect(renderedButton).toBeInTheDocument();
      userEvent.click(renderedButton);
      expect(dispatch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        type: "SET_EVALUATION_POLICY",
        data: policy,
      });
      expect(router.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("/playground");
    });

    it("should render the policy details when no section is specified", () => {
      expect(screen.getByText("Rego Policy Code")).toBeInTheDocument();
    });

    it("should render the policy details when the user navigates to that section", () => {
      router.asPath = `${chance.word()}#details`;
      rerender(<Policy />);

      expect(screen.getByText("Rego Policy Code")).toBeInTheDocument();
    });

    it("should render the policy history when the user navigates to that section", () => {
      router.asPath = `${chance.word()}#history`;
      rerender(<Policy />);

      policyVersions.forEach((version) => {
        expect(screen.getByText(version.message)).toBeInTheDocument();
      });
    });

    it("should render the policy assignments when the user navigates to that section", () => {
      router.asPath = `${chance.word()}#assignments`;
      rerender(<Policy />);

      assignments.forEach((assignment) => {
        expect(screen.getByText(assignment.policyGroup)).toBeInTheDocument();
      });
    });
  });

  describe("policy was not found", () => {
    beforeEach(() => {
      mockUsePolicy.policy = null;
      rerender(<Policy />);
    });

    it("should render a not found message if no policy is found", () => {
      expect(screen.getByText(/no policy found/i)).toBeInTheDocument();
    });
  });
});
