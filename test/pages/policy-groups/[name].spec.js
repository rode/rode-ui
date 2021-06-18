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
import PolicyGroup from "pages/policy-groups/[name]";

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/usePolicyGroup");

describe("Policy Group Details", () => {
  let router, dispatch, policyGroup, rerender;

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
    usePolicyGroup.mockReturnValue({
      policyGroup,
      loading: false,
    });
    useRouter.mockReturnValue(router);
    const utils = render(<PolicyGroup />, { policyDispatch: dispatch });
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
  });

  describe("policy group is not found", () => {
    beforeEach(() => {
      usePolicyGroup.mockReturnValue({
        policyGroup: null,
        loading: false,
      });
      rerender(<PolicyGroup />, { policyDispatch: dispatch });
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
