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
import { usePolicyGroup } from "hooks/usePolicyGroup";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import PolicyGroup from "pages/policy-groups/[name]";

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/usePolicyGroup");
jest.mock("hooks/usePaginatedFetch");

describe("Policy Group Details", () => {
  let router, dispatch, policyGroup, paginatedFetchResponse, rerender;

  beforeEach(() => {
    const policyGroupName = chance.string({ alpha: true, casing: "lower" });
    router = {
      back: jest.fn(),
      push: jest.fn().mockResolvedValue({}),
      query: {
        name: policyGroupName,
      },
    };
    dispatch = jest.fn();
    policyGroup = {
      [chance.string()]: chance.string(),
      name: policyGroupName,
      description: chance.string(),
    };
    paginatedFetchResponse = {
      data: [
        {
          id: chance.guid(),
          policyId: chance.guid(),
          policyName: chance.string({ alpha: true }),
          policyVersion: chance.d4().toString(),
        },
      ],
      loading: false,
    };
    usePolicyGroup.mockReturnValue({
      policyGroup,
      loading: false,
    });
    useRouter.mockReturnValue(router);
    usePaginatedFetch.mockReturnValue(paginatedFetchResponse);
    const utils = render(<PolicyGroup />, { dispatch: dispatch });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the page title", () => {
    expect(screen.getByText("Manage Policy Groups")).toBeInTheDocument();
  });

  it("should get the policy group", () => {
    expect(usePolicyGroup).toHaveBeenCalledWith(router.query.name);
  });

  describe("policy group exists", () => {
    it("should render the policy group name", () => {
      expect(screen.getByText(policyGroup.name)).toBeInTheDocument();
    });

    it("should render the description if it exists", () => {
      expect(screen.getByText(policyGroup.description)).toBeInTheDocument();
    });

    it("should render the button to edit the policy group", () => {
      const renderedButton = screen.getByText("Edit Policy Group");
      expect(renderedButton).toBeInTheDocument();

      userEvent.click(renderedButton);
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_CURRENT_POLICY_GROUP",
        data: policyGroup,
      });
      expect(router.push).toHaveBeenCalledWith(
        `/policy-groups/${policyGroup.name}/edit`
      );
    });

    it("should render the button to edit the assigned policies", () => {
      const renderedButton = screen.getByText("Edit Assignments");
      expect(renderedButton).toBeInTheDocument();

      userEvent.click(renderedButton);
      expect(router.push).toHaveBeenCalledWith(
        `/policy-groups/${router.query.name}/assignments`
      );
    });

    it("should call to get the current assignments", () => {
      expect(usePaginatedFetch).toHaveBeenCalledWith(
        `/api/policy-groups/${policyGroup.name}/assignments`,
        {},
        50
      );
    });

    it("should render a card for each current policy assignment", () => {
      const assignment = paginatedFetchResponse.data[0];
      expect(screen.getByText(assignment.policyName)).toBeInTheDocument();
      expect(screen.getByText(assignment.policyVersion)).toBeInTheDocument();

      const renderedViewPolicyButton = screen.getByText("View Policy");
      userEvent.click(renderedViewPolicyButton);
      expect(router.push).toHaveBeenCalledWith(
        `/policies/${assignment.policyId}`
      );
    });

    it("should render a message if no policies are assigned to the policy group", () => {
      usePaginatedFetch.mockResolvedValue({
        data: [],
        loading: false,
      });
      rerender(<PolicyGroup />);
      expect(
        screen.getByText("No policies are assigned to this policy group.")
      ).toBeInTheDocument();
    });
  });

  describe("policy group is not found", () => {
    beforeEach(() => {
      usePolicyGroup.mockReturnValue({
        policyGroup: null,
        loading: false,
      });
      rerender(<PolicyGroup />, { dispatch: dispatch });
    });

    it("should render the not found message", () => {
      expect(
        screen.getByText(/no policy group found under/i)
      ).toBeInTheDocument();
      const renderedLink = screen.getByText(/dashboard/i);
      expect(renderedLink).toBeInTheDocument();
      expect(renderedLink).toHaveAttribute("href", "/policy-groups");
    });
  });
});
