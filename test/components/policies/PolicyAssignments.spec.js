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
import PolicyAssignments from "components/policies/PolicyAssignments";
import { useFetch } from "hooks/useFetch";
import { useRouter } from "next/router";
import userEvent from "@testing-library/user-event";

jest.mock("hooks/useFetch");
jest.mock("next/router");

describe("PolicyAssignments", () => {
  let policy, policyAssignments, mockResponse, router, rerender;

  beforeEach(() => {
    policy = {
      id: chance.string(),
    };
    policyAssignments = chance.n(
      () => ({
        id: chance.guid(),
        policyGroup: chance.string(),
        policyVersionId: `${chance.guid()}.${chance.d4()}`,
      }),
      chance.d4()
    );

    mockResponse = {
      data: { data: policyAssignments },
      loading: false,
    };
    router = {
      push: jest.fn(),
    };

    useRouter.mockReturnValue(router);
    useFetch.mockReturnValue(mockResponse);
    const utils = render(<PolicyAssignments policy={policy} />);
    rerender = utils.rerender;
  });

  it("should call to fetch the policy assignments", () => {
    expect(useFetch).toHaveBeenCalledWith(
      `/api/policies/${policy.id}/assignments`
    );
  });

  it("should show a loading indicator while fetching the data", () => {
    mockResponse.loading = true;
    rerender(<PolicyAssignments policy={policy} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should show a card for each policy assignment", () => {
    policyAssignments.forEach((assignment, index) => {
      expect(screen.getByText(assignment.policyGroup)).toBeInTheDocument();

      const viewPolicyButton = screen.getAllByLabelText("View Policy Group")[
        index
      ];
      expect(viewPolicyButton).toBeInTheDocument();
      userEvent.click(viewPolicyButton);
      expect(router.push).toHaveBeenCalledWith(
        `/policy-groups/${assignment.policyGroup}`
      );
    });
  });

  it("should show a no assignments message if the policy is not assigned to any groups", () => {
    mockResponse.data = [];
    rerender(<PolicyAssignments policy={policy} />);
    expect(
      screen.getByText("This policy is not assigned to any policy groups.")
    ).toBeInTheDocument();
  });
});
