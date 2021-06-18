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
import PolicyGroupComponent from "test/testing-utils/hook-components/usePolicyGroupComponent";

jest.mock("hooks/useFetch");
jest.mock("utils/shared-utils");

describe("usePolicyGroup", () => {
  let policyGroup, dispatchMock, policyState, fetchResponse;

  beforeEach(() => {
    policyGroup = {
      name: chance.string(),
      description: chance.string(),
    };
    dispatchMock = jest.fn();
    policyState = {
      currentPolicyGroup: policyGroup,
    };

    fetchResponse = {
      data: policyGroup,
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
    render(<PolicyGroupComponent name={policyGroup.name} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should return the policy group if it is already saved in state", () => {
    render(<PolicyGroupComponent name={policyGroup.name} />, {
      policyState: policyState,
    });

    expect(useFetch).not.toHaveBeenCalledWith(
      `/api/policy-groups/${policyGroup.name}`
    );
    expect(screen.getByText(policyGroup.name)).toBeInTheDocument();
  });

  it("should fetch the policy group if it is not saved in state", () => {
    render(<PolicyGroupComponent name={policyGroup.name} />, {
      policyState: {},
      policyDispatch: dispatchMock,
    });

    expect(useFetch).toHaveBeenCalledWith(
      `/api/policy-groups/${policyGroup.name}`
    );
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "SET_CURRENT_POLICY_GROUP",
      data: policyGroup,
    });
  });

  it("should return nothing if the policy group has not yet been fetched", () => {
    fetchResponse.data = null;
    render(<PolicyGroupComponent name={policyGroup.name} />, {
      policyState: {},
      policyDispatch: dispatchMock,
    });

    expect(useFetch).toHaveBeenCalledWith(
      `/api/policy-groups/${policyGroup.name}`
    );
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
