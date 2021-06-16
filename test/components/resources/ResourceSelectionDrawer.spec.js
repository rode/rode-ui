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
import { RESOURCE_TYPES } from "utils/resource-utils";

jest.mock("hooks/usePaginatedFetch");

describe("ResourceSelectionDrawer", () => {
  let setEvaluationResource, clearEvaluation, dispatch, state;

  beforeEach(() => {
    dispatch = jest.fn();
    state = {
      searchTerm: chance.string(),
    };
    setEvaluationResource = jest.fn();
    clearEvaluation = jest.fn();
    const resourceResponse = {
      data: chance.n(
        () => ({
          id: createMockResourceUri(),
          name: chance.string(),
          type: chance.pickone(Object.values(RESOURCE_TYPES)),
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
        setEvaluationResource={setEvaluationResource}
      />,
      {
        resourceDispatch: dispatch,
        resourceState: state,
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

    userEvent.click(screen.getByLabelText(/close drawer/i));
    expect(drawer).toHaveClass("closedDrawer");
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

  it("should allow the user to navigate between sections once a resource has been selected", () => {
    searchAndSelectResource();
    const resourceButton = screen.getByLabelText("Resource");
    expect(resourceButton).toHaveClass("navigationButton");

    const versionButton = screen.getByLabelText("Version");
    expect(versionButton).toHaveClass("activeNavigationButton");

    userEvent.click(resourceButton);
    expect(resourceButton).toHaveClass("activeNavigationButton");
  });

  it("should take the user to the version selection once a resource has been selected", () => {
    searchAndSelectResource();

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

  it("should close the drawer and set the versioned resource once a resource and version have been selected", () => {
    searchAndSelectResource();
    act(() => {
      userEvent.click(screen.getAllByText(/^Select Version/i)[0]);
    });

    expect(screen.getByTestId("resourceSelectionDrawer")).toHaveClass(
      "closedDrawer"
    );
    expect(setEvaluationResource).toHaveBeenCalledTimes(1);
  });
});

const searchAndSelectResource = () => {
  const renderedAllResourcesButton = screen.getByLabelText(
    /view all resources/i
  );

  act(() => {
    userEvent.click(renderedAllResourcesButton);
  });
  act(() => {
    userEvent.click(screen.getAllByText(/^Select Resource/i)[0]);
  });
};
