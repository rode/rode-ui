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

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/useFetch");

describe("Policy Details", () => {
  let router, policy, mockUseFetch, rerender;

  beforeEach(() => {
    router = {
      query: {
        id: chance.guid(),
      },
    };
    policy = {
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.string(),
    };

    mockUseFetch = {
      data: policy,
      loading: false,
    };
    useFetch.mockReturnValue(mockUseFetch);
    useRouter.mockReturnValue(router);
    const utils = render(<Policy />, {
      policyState: { searchTerm: chance.string() },
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
