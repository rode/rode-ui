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
import { useRouter } from "next/router";
import { useFetch } from "hooks/useFetch";
import Policy from "pages/policies/[id]";
import userEvent from "@testing-library/user-event";
import {usePolicies} from "providers/policies";

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/useFetch");
// jest.mock("providers/policies");

describe("Policy Details", () => {
  let router, policy, mockUseFetch, rerender, dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn()
    router = {
      query: {
        id: chance.guid(),
      },
      push: jest.fn()
    };
    policy = {
      id: router.query.id,
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.string(),
    };

    // usePolicies.mockReturnValue({
    //   dispatch: dispatchMock
    // });

    mockUseFetch = {
      data: policy,
      loading: false,
    };
    useFetch.mockReturnValue(mockUseFetch);
    useRouter.mockReturnValue(router);
    const utils = render(<Policy />, {
      policyState: { searchTerm: chance.string() },
      policyDispatch: dispatchMock
    });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("fetching the policy", () => {
    it("should not call when there is no id present", () => {
      router.query.id = null;

      rerender(<Policy />);
      expect(useFetch).toHaveBeenCalledWith(null);
    });

    it("should call to fetch the policy when an id is present", () => {
      expect(useFetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenLastCalledWith(`/api/policies/${router.query.id}`);
    });

    it("should render the loading indicator", () => {
      mockUseFetch.loading = true;

      rerender(<Policy />);
      expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    });
  });

  describe("policy has been found", () => {
    it("should render the policy details once they have been fetched", () => {
      expect(screen.getByText(policy.name)).toBeInTheDocument();
      expect(screen.getByText(policy.description)).toBeInTheDocument();
      expect(screen.getByText(policy.regoContent)).toBeInTheDocument();
    });

    it("should render a button to edit the policy", () => {
      const renderedButton = screen.getByText('Edit Policy');
      expect(renderedButton).toBeInTheDocument();
      userEvent.click(renderedButton);

      expect(dispatchMock).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        type: 'SET_CURRENT_POLICY',
        data: policy
      });
      expect(router.push).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(`/policies/${policy.id}/edit`);
    });
  });

  describe("policy was not found", () => {
    beforeEach(() => {
      mockUseFetch.data = null;
      rerender(<Policy />);
    });

    it("should render a not found message if no policy is found", () => {
      expect(screen.getByText(/no policy found/i)).toBeInTheDocument();
    });
  });
});
