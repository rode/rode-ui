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
  let searchTerm, pushMock, dispatch, state, rerender;

  beforeEach(() => {
    pushMock = jest.fn();
    dispatch = jest.fn();
    searchTerm = chance.string();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    state = {
      policySearchTerm: searchTerm,
      resourceSearchTerm: searchTerm,
    };
    const utils = render(<Home />, { state, dispatch });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should clear any saved search terms", () => {
    expect(dispatch)
      .toHaveBeenCalledWith({
        type: "SET_RESOURCE_SEARCH_TERM",
        data: "",
      })
      .toHaveBeenCalledWith({
        type: "SET_POLICY_SEARCH_TERM",
        data: "",
      });
    expect(screen.queryByText(searchTerm)).not.toBeInTheDocument();
  });

  describe("resource card", () => {
    it("should render a card for resources and handle a valid search", () => {
      const renderedSearch = screen.getByLabelText(/search for a resource/i);
      expect(renderedSearch).toBeInTheDocument();

      const resourceSearchButton = screen.queryAllByTitle(/search/i)[0];

      userEvent.click(resourceSearchButton);
      expect(pushMock)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/resources?search=${searchTerm}`);
    });

    it("should render a card for resources and handle an empty search", () => {
      state.resourceSearchTerm = "";
      rerender(<Home />);
      let renderedSearch = screen.getByLabelText(/search for a resource/i);
      expect(renderedSearch).toBeInTheDocument();

      const resourceSearchButton = screen.queryAllByTitle(/search/i)[0];

      userEvent.click(resourceSearchButton);
      expect(pushMock)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/resources?search=all`);
    });
  });

  describe("policy card", () => {
    it("should render a card for policies and handle a valid search", () => {
      const renderedSearch = screen.getByLabelText(/search for a policy/i);
      expect(renderedSearch).toBeInTheDocument();

      const policySearchButton = screen.queryAllByTitle(/search/i)[1];
      userEvent.click(policySearchButton);
      expect(pushMock)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies?search=${searchTerm}`);
    });

    it("should render a card for policies and handle an empty search", () => {
      state.policySearchTerm = "";
      rerender(<Home />);
      let renderedSearch = screen.getByLabelText(/search for a policy/i);
      expect(renderedSearch).toBeInTheDocument();

      const resourceSearchButton = screen.queryAllByTitle(/search/i)[1];

      userEvent.click(resourceSearchButton);
      expect(pushMock)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies?search=all`);
    });
  });
});
