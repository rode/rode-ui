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
import PolicySearchResult from "components/policies/PolicySearchResult";
import { useRouter } from "next/router";

jest.mock("next/router");

describe("PolicySearchResult", () => {
  let searchResult, pushMock, dispatchMock;

  beforeEach(() => {
    searchResult = {
      name: chance.string(),
      description: chance.sentence(),
      id: chance.guid(),
      regoContent: chance.string(),
    };
    pushMock = jest.fn();
    dispatchMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    render(<PolicySearchResult searchResult={searchResult} />, {
      policyDispatch: dispatchMock,
    });
  });

  it("should render the policy details", () => {
    expect(
      screen.getByText(`Policy Name: ${searchResult.name}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Description: ${searchResult.description}`)
    ).toBeInTheDocument();
  });

  it("should render a view policy button ", () => {
    const renderedButton = screen.getByText("View Policy");

    expect(renderedButton).toBeInTheDocument();

    userEvent.click(renderedButton);
    expect(dispatchMock).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
      type: "SET_CURRENT_POLICY",
      data: searchResult,
    });
    expect(pushMock).toHaveBeenCalledWith(
      `/policies/${encodeURIComponent(searchResult.id)}`
    );
  });
});
