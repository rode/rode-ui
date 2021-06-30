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
import { useFetch } from "hooks/useFetch";
import { isServerSide } from "utils/shared-utils";
import PolicyGroupComponentAssignments from "test/testing-utils/hook-components/usePolicyGroupAssignmentsComponent";

jest.mock("hooks/useFetch");
jest.mock("utils/shared-utils");

describe("usePolicyGroupAssignments", () => {
  let policyGroupName, assignments, dispatch, state, fetchResponse;

  beforeEach(() => {
    policyGroupName = chance.string();
    assignments = chance.n(
      () => ({
        [chance.string()]: chance.string(),
        id: chance.guid(),
        policyGroup: policyGroupName,
      }),
      chance.d4()
    );
    dispatch = jest.fn();
    state = {
      currentPolicyGroupAssignments: assignments,
    };

    fetchResponse = {
      data: {
        data: assignments,
      },
      loading: false,
    };

    useFetch.mockReturnValue(fetchResponse);
    isServerSide.mockReturnValue(true);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return the loading status", () => {
    fetchResponse.loading = true;
    render(
      <PolicyGroupComponentAssignments policyGroupName={policyGroupName} />
    );

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should return the policy group assignments if they are already saved in state", () => {
    render(
      <PolicyGroupComponentAssignments policyGroupName={policyGroupName} />,
      {
        state: state,
      }
    );

    expect(useFetch).not.toHaveBeenCalledWith(
      `/api/policy-groups/${policyGroupName}/assignments`
    );
    expect(screen.getByText(assignments[0].id)).toBeInTheDocument();
  });

  it("should fetch the policy group assignments if they are not saved in state", () => {
    render(
      <PolicyGroupComponentAssignments policyGroupName={policyGroupName} />,
      {
        state: {},
        dispatch: dispatch,
      }
    );

    expect(useFetch).toHaveBeenCalledWith(
      `/api/policy-groups/${policyGroupName}/assignments`,
      {}
    );
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_CURRENT_POLICY_GROUP_ASSIGNMENTS",
      data: assignments,
    });
  });

  it("should return nothing if the policy group assignments have not yet been fetched", () => {
    fetchResponse.data = null;
    render(
      <PolicyGroupComponentAssignments policyGroupName={policyGroupName} />,
      {
        state: {},
        dispatch: dispatch,
      }
    );

    expect(useFetch).toHaveBeenCalledWith(
      `/api/policy-groups/${policyGroupName}/assignments`,
      {}
    );
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("should not call to fetch assignments if no policy group name is specified", () => {
    render(<PolicyGroupComponentAssignments policyGroupName={null} />);

    expect(useFetch).toHaveBeenCalledWith(null, {});
  });
});
