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
import { act, render, screen } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import ResourceSelectionDrawer from "components/playground/ResourceSelectionDrawer";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";

jest.mock("hooks/usePaginatedFetch");

describe("ResourceSelectionDrawer", () => {
  let setResource, clearEvaluation, dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    setResource = jest.fn();
    clearEvaluation = jest.fn();
    const resourceResponse = {
      data: chance.n(
        () => ({
          id: createMockResourceUri(),
          name: chance.string(),
          type: chance.pickone(["DOCKER", "NPM", "GIT"]),
        }),
        chance.d4() + 1
      ),
      loading: false,
    };

    const versionResponse = {
      data: chance.n(() => {
        const name = chance.string();
        return {
          versionedResourceUri: createMockResourceUri(name),
          aliases: chance.n(() => `${name}:${chance.string()}`),
        };
      }, 1),
      loading: false,
    };

    usePaginatedFetch.mockImplementation((endpoint) => {
      if (endpoint === "/api/resources") {
        return resourceResponse;
      }
      return versionResponse;
    });
    render(
      <ResourceSelectionDrawer
        clearEvaluation={clearEvaluation}
        setResource={setResource}
      />,
      {
        resourceDispatch: dispatch,
      }
    );
  });

  it("should have a button to open the drawer", () => {
    const resourceButton = screen.getByLabelText("Search for resources");
    const drawer = screen.getByTestId("resourceSelectionDrawer");
    expect(resourceButton).toBeInTheDocument();
    expect(drawer).toHaveClass("closedDrawer");

    userEvent.click(resourceButton);

    expect(drawer).toHaveClass("openDrawer");
    expect(dispatch)
      .toHaveBeenCalledWith({
        type: "SET_SEARCH_TERM",
        data: "",
      })
      .toHaveBeenCalledWith({
        type: "SET_VERSION_SEARCH_TERM",
        data: "",
      });
  });

  it("should show the drawer header", () => {
    const resourceButton = screen.getByLabelText("Resource");
    expect(resourceButton).toBeInTheDocument();
    expect(resourceButton).toHaveClass("activeNavigationButton");

    const versionButton = screen.getByLabelText("Version");
    expect(versionButton).toBeInTheDocument();
    expect(versionButton).toBeDisabled();
    expect(versionButton).toHaveClass("navigationButton");
  });

  it("should take the user to the version selection once a resource has been selected", () => {
    const renderedAllResourcesButton = screen.getByLabelText(
      /view all resources/i
    );

    act(() => {
      userEvent.click(renderedAllResourcesButton);
    });
    act(() => {
      userEvent.click(screen.getAllByText(/^Select Resource/i)[0]);
    });

    const renderedAllVersionsButton = screen.getByLabelText(
      /view all versions/i
    );
    expect(renderedAllVersionsButton).toBeInTheDocument();

    const resourceButton = screen.getByLabelText("Resource");
    expect(resourceButton).toHaveClass("navigationButton");

    const versionButton = screen.getByLabelText("Version");
    expect(versionButton).toBeEnabled();
    expect(versionButton).toHaveClass("activeNavigationButton");

    expect(clearEvaluation).toHaveBeenCalled();
  });
});
