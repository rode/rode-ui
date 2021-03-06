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
import ChangeVersionDrawer from "components/resources/ChangeVersionDrawer";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("next/router");
jest.mock("hooks/usePaginatedFetch");

describe("ChangeVersionDrawer", () => {
  let isOpen,
    closeDrawer,
    state,
    paginatedFetchResponse,
    dispatch,
    router,
    rerender;

  beforeEach(() => {
    isOpen = true;
    closeDrawer = jest.fn();
    state = {
      currentResource: {
        resourceName: chance.string(),
        resourceVersion: chance.string(),
        genericName: chance.string(),
        uri: createMockResourceUri(),
      },
      resourceVersionSearchTerm: "all",
    };
    dispatch = jest.fn();
    paginatedFetchResponse = {
      data: [],
      loading: false,
      goToNextPage: jest.fn(),
      isLastPage: false,
    };
    router = {
      push: jest.fn(),
    };

    useRouter.mockReturnValue(router);

    usePaginatedFetch.mockReturnValue(paginatedFetchResponse);

    const utils = render(
      <ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />,
      {
        state,
        dispatch,
      }
    );

    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should not call to fetch the versions if there is no resource selected", () => {
    state.currentResource = {};
    rerender(<ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />);
    expect(usePaginatedFetch).toHaveBeenCalledWith(null, { id: undefined }, 10);
  });

  it("should call to fetch the versions when a resource is selected", () => {
    expect(usePaginatedFetch).toHaveBeenCalledWith(
      "/api/resource-versions",
      { id: state.currentResource.genericName },
      10
    );
  });

  it("should call to fetch the versions when a resource is selected and a search term is specified", () => {
    const searchTerm = chance.string();
    state.resourceVersionSearchTerm = searchTerm;
    rerender(<ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />);

    expect(usePaginatedFetch).toHaveBeenCalledWith(
      "/api/resource-versions",
      {
        id: state.currentResource.genericName,
        filter: `version.contains("${searchTerm}")`,
      },
      10
    );
  });

  it("should render a loading indicator when fetching the data", () => {
    paginatedFetchResponse.loading = true;
    rerender(<ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should show a not found message if no data is found for the resource", () => {
    expect(screen.getByText(/no versions found matching the given criteria./i));
  });

  it("should set the search term to all when the drawer is closed", () => {
    isOpen = false;
    rerender(<ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />);
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_RESOURCE_VERSION_SEARCH_TERM",
      data: "all",
    });
  });

  it("should render the version search bar", () => {
    const renderedSearchBar = screen.getByLabelText(/search for a version/i);

    expect(renderedSearchBar).toBeInTheDocument();
    let searchTerm = "all";
    userEvent.type(renderedSearchBar, searchTerm);
    userEvent.click(screen.getByLabelText(/^search versions/i));

    expect(usePaginatedFetch).toHaveBeenLastCalledWith(
      "/api/resource-versions",
      {
        id: state.currentResource.genericName,
      },
      10
    );

    userEvent.click(screen.getByLabelText(/^view all versions/i));
    expect(usePaginatedFetch).toHaveBeenLastCalledWith(
      "/api/resource-versions",
      {
        id: state.currentResource.genericName,
      },
      10
    );
  });

  describe("matching versions are found", () => {
    beforeEach(() => {
      const name = chance.string();
      paginatedFetchResponse.data = chance.n(
        () => ({
          versionedResourceUri: createMockResourceUri(name, chance.string()),
          aliases: chance.n(() => `${name}:${chance.string()}`, chance.d4()),
          created: chance.timestamp(),
        }),
        chance.d4() + 2
      );
      paginatedFetchResponse.data[0].versionedResourceUri = createMockResourceUri(
        name,
        state.currentResource.resourceVersion
      );
      rerender(
        <ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />
      );
    });

    it("should render the instructions", () => {
      expect(
        screen.getByText(state.currentResource.resourceName)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /select from the list below to see occurrences related to that version/i
        )
      ).toBeInTheDocument();
    });

    it("should render a card for each available version", () => {
      paginatedFetchResponse.data.forEach((version, index) => {
        const { resourceVersion, aliasLabel, aliases } = getResourceDetails(
          version.versionedResourceUri,
          version
        );
        expect(screen.getAllByText("Version")[index]).toBeInTheDocument();
        expect(
          screen.getAllByText(resourceVersion.substring(0, 12))[0]
        ).toBeInTheDocument();
        expect(screen.getAllByText(aliasLabel)[index]).toBeInTheDocument();
        expect(screen.getByText(aliases.join(", "))).toBeInTheDocument();
        expect(screen.getAllByText("Created")[index]).toBeInTheDocument();
      });
    });

    it("should render the button to select a version", () => {
      const renderedSelectButtons = screen.getAllByLabelText("Select");
      const versionToSelect =
        renderedSelectButtons[renderedSelectButtons.length - 1];
      const versionUri = encodeURIComponent(
        paginatedFetchResponse.data[paginatedFetchResponse.data.length - 1]
          .versionedResourceUri
      );
      userEvent.click(versionToSelect);
      expect(router.push).toHaveBeenCalledWith(`/resources/${versionUri}`);
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_OCCURRENCE_DETAILS",
        data: null,
      });
      expect(closeDrawer).toHaveBeenCalledTimes(1);
    });

    it("should render the currently selected version as 'Selected'", () => {
      const renderedSelectedIcon = screen.getByTitle(/check/i);

      expect(renderedSelectedIcon).toBeInTheDocument();
      expect(renderedSelectedIcon.closest("button")).toBeDisabled();
    });

    it("should render a view more button if there are more results to fetch", () => {
      const renderedViewMoreButton = screen.getByLabelText("View More");

      expect(renderedViewMoreButton).toBeInTheDocument();
      userEvent.click(renderedViewMoreButton);

      expect(paginatedFetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
    });
  });
});
