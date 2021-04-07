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
import { render, screen, act } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import ResourceSearchAndResults from "components/playground/ResourceSearchAndResults";
import { useFetch } from "hooks/useFetch";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("hooks/useFetch");

describe("ResourceSearchAndResults", () => {
  let resource,
    setResource,
    clearEvaluation,
    state,
    dispatch,
    fetchResponse,
    rerender;

  beforeEach(() => {
    resource = {};
    setResource = jest.fn();
    clearEvaluation = jest.fn();
    state = {
      searchTerm: chance.string(),
    };
    dispatch = jest.fn();
    fetchResponse = {
      data: chance.string(),
      loading: false,
    };

    useFetch.mockReturnValue(fetchResponse);

    const utils = render(
      <ResourceSearchAndResults
        policy={resource}
        setResource={setResource}
        clearEvaluation={clearEvaluation}
      />,
      {
        resourceState: state,
        resourceDispatch: dispatch,
      }
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the search bar", () => {
    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });

  it("should render the loading indicator when searching for a resource", () => {
    fetchResponse.loading = true;
    fetchResponse.data = null;

    searchForResource();

    expect(useFetch).toHaveBeenCalledWith("/api/resources", {
      filter: state.searchTerm,
    });
    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render a search result for each resource found", () => {
    let resources = chance.n(
      () => ({
        uri: createMockResourceUri(),
      }),
      chance.d4()
    );

    fetchResponse.loading = false;
    fetchResponse.data = resources;

    searchForResource();

    expect(screen.queryByTestId("loadingIndicator")).not.toBeInTheDocument();
    resources.forEach((resource) => {
      const { resourceName, resourceVersion } = getResourceDetails(
        resource.uri
      );
      expect(screen.getByText(resourceName)).toBeInTheDocument();
      expect(
        screen.getByText(`Version: ${resourceVersion}`)
      ).toBeInTheDocument();
    });
  });

  it("should select the resource when prompted", () => {
    let resources = chance.n(
      () => ({
        uri: createMockResourceUri(),
      }),
      chance.d4()
    );

    fetchResponse.loading = false;
    fetchResponse.data = resources;

    searchForResource();

    const { resourceName, resourceVersion } = getResourceDetails(
      resources[0].uri
    );

    userEvent.click(screen.getAllByText("Select Resource")[0]);
    expect(setResource).toHaveBeenCalledWith({
      uri: resources[0].uri,
      name: resourceName,
      version: resourceVersion,
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_SEARCH_TERM",
      data: "",
    });
  });

  it("should render a resource as selected if it is the current resource to evaluate", () => {
    let resources = chance.n(
      () => ({
        uri: createMockResourceUri(),
      }),
      chance.d4()
    );

    fetchResponse.loading = false;
    fetchResponse.data = resources;
    const { resourceName, resourceVersion } = getResourceDetails(
      resources[0].uri
    );

    rerender(
      <ResourceSearchAndResults
        setResource={setResource}
        clearEvaluation={clearEvaluation}
        resource={{
          uri: resources[0].uri,
          name: resourceName,
          version: resourceVersion,
        }}
      />
    );

    searchForResource();

    expect(
      screen.getByRole("button", { name: "Selected" })
    ).toBeInTheDocument();
  });

  it("should render the no resource found message if no resources were found", () => {
    fetchResponse.loading = false;
    fetchResponse.data = [];

    rerender(
      <ResourceSearchAndResults
        setResource={setResource}
        clearEvaluation={clearEvaluation}
      />
    );
    searchForResource();

    expect(screen.getByText(/no resources found/i)).toBeInTheDocument();
  });
});

const searchForResource = () => {
  const renderedSearch = screen.getByText(/search for a resource/i);
  const renderedSearchButton = screen.getByTitle(/search/i);

  act(() => {
    userEvent.type(renderedSearch, chance.string());
  });
  act(() => {
    userEvent.click(renderedSearchButton);
  });
};
