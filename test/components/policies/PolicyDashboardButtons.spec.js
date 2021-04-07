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
import { useRouter } from "next/router";
import userEvent from "@testing-library/user-event";
import PolicyDashboardButtons from "components/policies/PolicyDashboardButtons";

jest.mock("next/router");
jest.mock("hooks/useFetch");
jest.mock("providers/policies");

describe("PolicyDashboardButtons", () => {
  let pushMock, mockRouter;
  beforeEach(() => {
    pushMock = jest.fn();
    mockRouter = {
      query: {},
      push: pushMock,
    };
    useRouter.mockReturnValue(mockRouter);
    render(<PolicyDashboardButtons />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render a button to create a new policy", () => {
    const renderedNewPolicyButton = screen.getByText(/create new policy/i);
    expect(renderedNewPolicyButton).toBeInTheDocument();

    userEvent.click(renderedNewPolicyButton);

    expect(pushMock)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("/policies/new");
  });

  it("should render a button to go to the policy evaluation playground", () => {
    const renderedPlaygroundButton = screen.getByText(
      /policy evaluation playground/i
    );
    expect(renderedPlaygroundButton).toBeInTheDocument();

    userEvent.click(renderedPlaygroundButton);

    expect(pushMock)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("/playground");
  });
});
