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
import Resources from "pages/resources";
import { useRouter } from "next/router";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import userEvent from "@testing-library/user-event";
import { buildResourceQueryParams, RESOURCE_TYPES } from "utils/resource-utils";

jest.mock("next/router");
jest.mock("hooks/usePaginatedFetch");

describe("Resources", () => {
  let mockRouter,
    expectedSearch,
    resources,
    dispatch,
    state,
    mockFetchResponse,
    rerender;

  beforeEach(() => {
    expectedSearch = chance.string({ alpha: true });
    mockRouter = {
      query: {
        search: expectedSearch,
      },
      push: jest.fn(),
    };
    dispatch = jest.fn();
    state = {
      resourceSearchTerm: expectedSearch,
      resourceTypeSearchFilter: [],
    };
    resources = chance.n(
      () => ({
        id: chance.guid(),
        name: chance.string({ alpha: true }),
        type: chance.pickone(Object.values(RESOURCE_TYPES)),
      }),
      chance.d4() + 2
    );
    mockFetchResponse = {
      data: resources,
      loading: false,
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    usePaginatedFetch.mockReturnValue(mockFetchResponse);
    const utils = render(<Resources />, { state, dispatch });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a resource", () => {
    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });

  it("should clear the saved search term if it doesn't exist in the url", () => {
    mockRouter.query.search = "";
    rerender(<Resources />);

    expect(dispatch).toHaveBeenLastCalledWith({
      type: "SET_RESOURCE_SEARCH_TERM",
      data: "",
    });
  });

  it("should save the search term specified in the url", () => {
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_RESOURCE_SEARCH_TERM",
      data: expectedSearch,
    });
  });

  describe("searching for resources", () => {
    it("should search for all resources if a search term does not exist", () => {
      state.resourceSearchTerm = "";
      rerender(<Resources />);
      const renderedSearchButton = screen.getByTitle(/search/i);
      expect(renderedSearchButton).toBeInTheDocument();

      userEvent.click(renderedSearchButton);
      expect(mockRouter.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/resources?search=all`);
    });

    it("should kick off the search when the search button is pressed and a search term exists", () => {
      const renderedSearchButton = screen.getByTitle(/search/i);
      expect(renderedSearchButton).toBeInTheDocument();

      userEvent.click(renderedSearchButton);
      expect(mockRouter.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/resources?search=${expectedSearch}`);
    });

    it("should kick off the search when the user navigates away from the search bar", () => {
      const blurTrigger = chance.string();
      rerender(
        <>
          <p>{blurTrigger}</p>
          <Resources />
        </>
      );

      const renderedInput = screen.getByLabelText(/^search for a resource$/i);

      userEvent.click(renderedInput);
      userEvent.click(screen.getByText(blurTrigger));
      expect(mockRouter.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/resources?search=${expectedSearch}`);
    });

    it("should render a loading indicator when fetching results", () => {
      mockFetchResponse.loading = true;
      rerender(<Resources />);

      expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    });

    it("should pass the search term through as a filter", () => {
      expect(usePaginatedFetch).toHaveBeenCalledTimes(2).toHaveBeenCalledWith(
        "/api/resources",
        {
          searchTerm: expectedSearch,
        },
        10
      );
    });

    it("should handle search for all resources", () => {
      state.resourceSearchTerm = "all";
      rerender(<Resources />);

      expect(usePaginatedFetch).toHaveBeenLastCalledWith(
        "/api/resources",
        buildResourceQueryParams(
          state.resourceSearchTerm,
          state.resourceTypeSearchFilter
        ),
        10
      );
    });

    it("should handle viewing all resources by clicking the view all resources button", () => {
      userEvent.click(screen.getByText(/^view all resources/));

      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_RESOURCE_TYPE_SEARCH_FILTER",
        data: [],
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/resources?search=all");
    });

    it("should render all of the search results", () => {
      resources.forEach((resource, index) => {
        expect(screen.getByText(resource.name)).toBeInTheDocument();
        expect(screen.getAllByText(/type/i)[index]).toBeInTheDocument();
      });
    });

    it("should render a button to view more results if the user is not at the end of the found results", () => {
      mockFetchResponse.isLastPage = false;

      rerender(<Resources />);
      const viewMoreButton = screen.getByRole("button", { name: "View More" });
      expect(viewMoreButton).toBeInTheDocument();
      userEvent.click(viewMoreButton);
      expect(mockFetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
    });

    it("should render a message when there are no results", () => {
      mockFetchResponse.data = [];

      rerender(<Resources />);

      expect(screen.getByText("No resources found")).toBeInTheDocument();
    });
  });
});
