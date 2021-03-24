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

import { render, screen } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import React from "react";
import { useRouter } from "next/router";

import Home from "pages/index";

jest.mock("next/router");

describe("index", () => {
  let searchTerm, pushMock, policyDispatch, resourceDispatch, rerender;

  beforeEach(() => {
    pushMock = jest.fn();
    policyDispatch = jest.fn();
    resourceDispatch = jest.fn();
    searchTerm = chance.string();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    const utils = render(<Home />, {
      resourceState: {
        searchTerm: " ",
      },
      policyState: {
        searchTerm,
      },
      policyDispatch,
      resourceDispatch,
    });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should clear any saved search terms", () => {
    expect(resourceDispatch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
      type: "SET_SEARCH_TERM",
      data: "",
    });
    expect(policyDispatch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
      type: "SET_SEARCH_TERM",
      data: "",
    });
    expect(screen.queryByText(searchTerm)).not.toBeInTheDocument();
  });

  it("should render a card for resources", () => {
    let renderedSearch = screen.getByLabelText(/search for a resource/i);
    expect(renderedSearch).toBeInTheDocument();

    let resourceSearchButton = screen.queryAllByTitle(/search/i)[0];

    userEvent.click(resourceSearchButton);
    expect(pushMock).not.toHaveBeenCalled();

    rerender(<Home />, {
      resourceState: {
        searchTerm,
      },
      policyState: {
        searchTerm,
      },
      policyDispatch,
      resourceDispatch,
    });

    console.log("searchTerm in test", searchTerm);
    // TODO: figure out why this isn't working
    // userEvent.type(renderedSearch, searchTerm);
    // resourceSearchButton = screen.queryAllByTitle(/search/i)[0];

    // userEvent.click(resourceSearchButton);
    // expect(pushMock)
    //   .toHaveBeenCalledTimes(1)
    //   .toHaveBeenCalledWith(`/resources?search=${searchTerm}`);
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
