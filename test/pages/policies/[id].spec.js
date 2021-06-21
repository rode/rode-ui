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

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/usePolicy");
jest.mock("hooks/usePaginatedFetch");

describe("Policy Details", () => {
  let router,
    policy,
    mockUsePolicy,
    policyVersions,
    mockPaginatedFetch,
    rerender,
    dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    router = {
      query: {
        id: chance.guid(),
      },
      push: jest.fn(),
      asPath: chance.string(),
    };
    policy = {
      id: router.query.id,
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.word({ syllables: 4 }),
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
    usePolicy.mockReturnValue(mockUsePolicy);
    useRouter.mockReturnValue(router);
    mockPaginatedFetch = {
      data: policyVersions,
      loading: false,
      isLastPage: false,
      goToNextPage: jest.fn(),
    };
    usePaginatedFetch.mockReturnValue(mockPaginatedFetch);
    const utils = render(<Policy />, {
      policyState: { searchTerm: "test search term" },
      policyDispatch: dispatchMock,
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
      expect(screen.getByText(policy.name)).toBeInTheDocument();
      expect(screen.getByText(policy.description)).toBeInTheDocument();

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
      expect(dispatchMock).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
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
