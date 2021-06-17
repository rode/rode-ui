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
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import userEvent from "@testing-library/user-event";
import PolicyGroups from "pages/policy-groups";

jest.mock("next/router");
jest.mock("hooks/usePaginatedFetch");

describe("Policy Groups", () => {
  let router, policyGroups, mockPaginatedFetchResponse, rerender;
  beforeEach(() => {
    policyGroups = chance.n(
      () => ({
        name: chance.string(),
        description: chance.string(),
      }),
      chance.d4()
    );
    mockPaginatedFetchResponse = {
      data: policyGroups,
      loading: false,
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
    };
    router = {
      query: {},
      push: jest.fn(),
    };
    useRouter.mockReturnValue(router);

    usePaginatedFetch.mockReturnValue(mockPaginatedFetchResponse);
    const utils = render(<PolicyGroups />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the page header", () => {
    const renderedHeader = screen.getByText(/^manage policy groups$/i);
    expect(renderedHeader).toBeInTheDocument();
  });

  it("should render a button to create a new policy group", () => {
    const renderedButton = screen.getByText(/^create new policy group$/i);
    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);
    expect(router.push)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("/policy-groups/new");
  });

  it("should call to fetch the policy groups", () => {
    expect(usePaginatedFetch).toHaveBeenCalledWith(
      "/api/policy-groups",
      {},
      100
    );
  });

  it("should render the loading indicator while fetching data", () => {
    mockPaginatedFetchResponse.loading = true;
    rerender(<PolicyGroups />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render a card for each policy group found", () => {
    mockPaginatedFetchResponse.data.forEach((group) => {
      expect(screen.getByText(group.name)).toBeInTheDocument();
      expect(screen.getByText(group.description)).toBeInTheDocument();
    });
  });

  it("should render the card with no description if it is not present", () => {
    mockPaginatedFetchResponse.data[0].description = "";
    rerender(<PolicyGroups />);
    const renderedName = screen.getByText(
      mockPaginatedFetchResponse.data[0].name
    );
    expect(renderedName.closest("div").children).toHaveLength(1);
  });

  it("should render the button to view more if there are multiple pages of results", () => {
    mockPaginatedFetchResponse.isLastPage = false;
    rerender(<PolicyGroups />);

    const renderedButton = screen.getByText("View More");
    expect(renderedButton).toBeInTheDocument;
    userEvent.click(renderedButton);
    expect(mockPaginatedFetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
  });

  it("should render the no policy groups found message if no groups are found", () => {
    mockPaginatedFetchResponse.data = [];
    rerender(<PolicyGroups />);

    expect(screen.getByText(/no policy groups exist./i)).toBeInTheDocument();
  });
});
