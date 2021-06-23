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
import PolicyComponent from "test/testing-utils/hook-components/usePolicyComponent";

jest.mock("hooks/useFetch");
jest.mock("utils/shared-utils");

describe("usePolicy", () => {
  let policy, dispatch, state, fetchResponse;

  beforeEach(() => {
    policy = {
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.string(),
      id: chance.guid(),
    };
    dispatch = jest.fn();
    state = {
      currentPolicy: policy,
    };

    fetchResponse = {
      data: policy,
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
    render(<PolicyComponent id={policy.id} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should return the policy if it is already saved in state", () => {
    render(<PolicyComponent id={policy.id} />, { state });

    expect(useFetch).not.toHaveBeenCalledWith(`/api/policies/${policy.id}`);
    expect(screen.getByText(policy.name)).toBeInTheDocument();
  });

  it("should fetch the policy if it is not saved in state", () => {
    render(<PolicyComponent id={policy.id} />, {
      state: {},
      dispatch: dispatch,
    });

    expect(useFetch).toHaveBeenCalledWith(`/api/policies/${policy.id}`);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_CURRENT_POLICY",
      data: policy,
    });
  });

  it("should return nothing if the policy has not yet been fetched", () => {
    fetchResponse.data = null;
    render(<PolicyComponent id={policy.id} />, {
      state: {},
      dispatch: dispatch,
    });

    expect(useFetch).toHaveBeenCalledWith(`/api/policies/${policy.id}`);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
