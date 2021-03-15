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
import userEvent from "@testing-library/user-event";
import PolicySearchResult from "components/policies/PolicySearchResult";
import { useRouter } from "next/router";
import { createMockResourceUri } from "test/testing-utils/mocks";

jest.mock("next/router");

// TODO: update with policy information

describe("PolicySearchResult", () => {
  let searchResult, resourceName, version, pushMock;

  beforeEach(() => {
    resourceName = chance.word();
    version = chance.word();
    searchResult = {
      uri: createMockResourceUri(resourceName, version),
    };
    pushMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    render(<PolicySearchResult searchResult={searchResult} />);
  });

  it("should render the policy details", () => {
    expect(
      screen.getByText(`Policy Name: ${resourceName}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`Description: ${version}`)).toBeInTheDocument();
  });

  it("should render a view policy button ", () => {
    const renderedButton = screen.getByText("View Policy");

    expect(renderedButton).toBeInTheDocument();

    userEvent.click(renderedButton);
    expect(pushMock).toHaveBeenCalledWith(
      `/policies/${encodeURIComponent(searchResult.uri)}`
    );
  });
});