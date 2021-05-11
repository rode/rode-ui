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

jest.mock("next/router");
jest.mock("hooks/usePaginatedFetch");

describe("ChangeVersionDrawer", () => {
  let isOpen,
    closeDrawer,
    resourceState,
    paginatedFetchResponse,
    resourceDispatch,
    router;

  beforeEach(() => {
    isOpen = true;
    closeDrawer = jest.fn();
    resourceState = {
      currentResource: {
        resourceName: chance.string(),
        resourceVersion: chance.string(),
        versionFilter: chance.string(),
      },
    };
    resourceDispatch = jest.fn();
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
  });

  it("should not call to fetch the versions if there is no resource selected", () => {
    resourceState.currentResource = {};
    render(<ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />, {
      resourceState,
      resourceDispatch,
    });
    expect(usePaginatedFetch).toHaveBeenCalledWith(
      null,
      { filter: undefined },
      10
    );
  });

  it("should call to fetch the versions when a resource is selected", () => {
    render(<ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />, {
      resourceState,
      resourceDispatch,
    });
    expect(usePaginatedFetch).toHaveBeenCalledWith(
      "/api/resource-versions",
      { filter: resourceState.currentResource.versionFilter },
      10
    );
  });

  it("should render a loading indicator when fetching the data", () => {
    paginatedFetchResponse.loading = true;
    render(<ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />, {
      resourceState,
      resourceDispatch,
    });

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should show a not found message if no data is found for the resource", () => {
    render(<ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />, {
      resourceState,
      resourceDispatch,
    });

    expect(screen.getByText(/no versions found matching the resource/i));
  });

  describe("matching versions are found", () => {
    beforeEach(() => {
      paginatedFetchResponse.data = chance.n(
        () => ({
          resourceVersion: chance.string(),
          uri: chance.string(),
        }),
        chance.d4() + 2
      );
      paginatedFetchResponse.data[0].resourceVersion =
        resourceState.currentResource.resourceVersion;
      render(
        <ChangeVersionDrawer isOpen={isOpen} closeDrawer={closeDrawer} />,
        { resourceState, resourceDispatch }
      );
    });

    it("should render the instructions", () => {
      expect(
        screen.getByText(resourceState.currentResource.resourceName)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /select from the list below to see occurrences related to that version/i
        )
      ).toBeInTheDocument();
    });

    it("should render a card for each available version", () => {
      paginatedFetchResponse.data.forEach((version, index) => {
        expect(screen.getAllByText("Version")[index]).toBeInTheDocument();
        expect(
          screen.getByText(version.resourceVersion.substring(0, 12))
        ).toBeInTheDocument();
      });
    });

    it("should render the button to select a version", () => {
      const renderedSelectButtons = screen.getAllByLabelText("Select");
      const versionToSelect =
        renderedSelectButtons[renderedSelectButtons.length - 1];
      const versionUri = encodeURIComponent(
        paginatedFetchResponse.data[paginatedFetchResponse.data.length - 1].uri
      );
      userEvent.click(versionToSelect);
      expect(router.push).toHaveBeenCalledWith(`/resources/${versionUri}`);
      expect(resourceDispatch).toHaveBeenCalledWith({
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
