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
import Resources from "pages/resources";
import { useRouter } from "next/router";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { useAppState } from "providers/appState";
import userEvent from "@testing-library/user-event";
import { buildResourceQueryParams, RESOURCE_TYPES } from "utils/resource-utils";

jest.mock("next/router");
jest.mock("hooks/usePaginatedFetch");
jest.mock("providers/appState");

describe("Resources", () => {
  let mockRouter, mockDispatch, mockState, mockFetchResponse;

  beforeEach(() => {
    mockRouter = {
      query: {},
      push: jest.fn(),
    };
    mockDispatch = jest.fn();
    mockState = {
      resourceSearchTerm: "",
      resourceTypeSearchFilter: [],
    };
    mockFetchResponse = {
      data: null,
      loading: chance.bool(),
      isLastPage: chance.bool(),
      goToNextPage: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    useAppState.mockReturnValue({
      dispatch: mockDispatch,
      state: mockState,
    });

    usePaginatedFetch.mockReturnValue(mockFetchResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a resource", () => {
    render(<Resources />);

    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });

  describe("searching for resources", () => {
    let resources, expectedSearch;

    beforeEach(() => {
      resources = chance.n(
        () => ({
          id: chance.string(),
          name: chance.string(),
          type: chance.pickone(Object.values(RESOURCE_TYPES)),
        }),
        chance.d4()
      );
      expectedSearch = chance.word();
      mockRouter.query.search = expectedSearch;
      mockFetchResponse.data = resources;
      mockFetchResponse.loading = false;
    });

    it("should search for all resources if a search term does not exist", () => {
      mockState.resourceSearchTerm = " ";
      render(<Resources />);
      const renderedSearchButton = screen.getByTitle(/search/i);
      expect(renderedSearchButton).toBeInTheDocument();

      userEvent.click(renderedSearchButton);
      expect(mockRouter.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/resources?search=all`);
    });

    it("should kick off the search when the search button is pressed and a search term exists", () => {
      mockState.resourceSearchTerm = expectedSearch;
      render(<Resources />);

      const renderedSearchButton = screen.getByTitle(/search/i);
      expect(renderedSearchButton).toBeInTheDocument();

      userEvent.click(renderedSearchButton);
      expect(mockRouter.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/resources?search=${expectedSearch}`);
    });

    it("should kick off the search when the user navigates away from the search bar", () => {
      const blurTrigger = chance.string();
      mockState.resourceSearchTerm = expectedSearch;
      render(
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
      render(<Resources />);

      expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    });

    it("should pass the search term through as a filter", () => {
      mockState.resourceSearchTerm = expectedSearch;
      render(<Resources />);

      expect(usePaginatedFetch).toHaveBeenCalledTimes(2).toHaveBeenCalledWith(
        "/api/resources",
        {
          searchTerm: expectedSearch,
        },
        10
      );
    });

    it("should handle search for all resources", () => {
      mockState.resourceSearchTerm = "all";
      render(<Resources />);

      expect(usePaginatedFetch)
        .toHaveBeenCalledTimes(2)
        .toHaveBeenCalledWith(
          "/api/resources",
          buildResourceQueryParams(
            mockState.resourceSearchTerm,
            mockState.resourceTypeSearchFilter
          ),
          10
        );
    });

    it("should handle viewing all resources by clicking the view all resources button", () => {
      render(<Resources />);

      userEvent.click(screen.getByText(/^view all resources/));

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_RESOURCE_TYPE_SEARCH_FILTER",
        data: [],
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/resources?search=all");
    });

    it("should render all of the search results", () => {
      render(<Resources />);

      resources.forEach((resource, index) => {
        expect(screen.getByText(resource.name)).toBeInTheDocument();
        expect(screen.getAllByText(/type/i)[index]).toBeInTheDocument();
      });
    });

    it("should render a button to view more results if the user is not at the end of the found results", () => {
      mockFetchResponse.isLastPage = false;

      render(<Resources />);
      const viewMoreButton = screen.getByRole("button", { name: "View More" });
      expect(viewMoreButton).toBeInTheDocument();
      userEvent.click(viewMoreButton);
      expect(mockFetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
    });

    it("should render a message when there are no results", () => {
      mockFetchResponse.data = [];

      render(<Resources />);

      expect(screen.getByText("No resources found")).toBeInTheDocument();
    });
  });
});
