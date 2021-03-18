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

import { render, screen, cleanup } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import React from "react";
import { useRouter } from "next/router";

import Home from "pages/index";

jest.mock("next/router");

describe("index", () => {
  let searchTerm, pushMock;

  beforeEach(() => {
    pushMock = jest.fn();
    searchTerm = chance.string();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    render(<Home />, {
      resourceState: {
        searchTerm,
      },
      policyState: {
        searchTerm,
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should clear any saved search terms", () => {
    const [resourceSearch, policySearch] = screen.queryAllByLabelText(
      /search for a/i
    );

    console.log("resourceSearch", resourceSearch);

    expect(resourceSearch).toHaveDisplayValue("");
    expect(policySearch).toHaveDisplayValue("");
    expect(screen.queryByText(searchTerm)).not.toBeInTheDocument();
  });

  it("should render a card for resources", () => {
    const renderedSearch = screen.getByLabelText(/search for a resource/i);
    expect(renderedSearch).toBeInTheDocument();

    const resourceSearchButton = screen.queryAllByTitle(/search/i)[0];
    userEvent.type(renderedSearch, "{space}");
    userEvent.click(resourceSearchButton);
    expect(pushMock).not.toHaveBeenCalled();

    userEvent.type(renderedSearch, searchTerm);

    userEvent.click(resourceSearchButton);
    expect(pushMock)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(`/resources?search=${searchTerm}`);
  });

  it("should render a card for policies", () => {
    const renderedSearch = screen.getByLabelText(/search for a policy/i);
    expect(renderedSearch).toBeInTheDocument();

    userEvent.type(renderedSearch, searchTerm);

    const policySearchButton = screen.queryAllByTitle(/search/i)[1];
    userEvent.click(policySearchButton);
    expect(pushMock)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(`/policies?search=${searchTerm}`);
  });
});
