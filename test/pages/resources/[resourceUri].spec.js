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
import Resource from "pages/resources/[resourceUri]";
import { useRouter } from "next/router";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";
import userEvent from "@testing-library/user-event";
import { useFetch } from "hooks/useFetch";

jest.mock("next/router");
jest.mock("hooks/useFetch");

describe("Resource Details page", () => {
  let resourceState,
    router,
    policyDispatch,
    resourceDispatch,
    unmount,
    rerender;

  beforeEach(() => {
    const resourceUri = createMockResourceUri();
    router = {
      query: {
        resourceUri,
      },
      push: jest.fn(),
    };

    resourceState = {
      currentResource: {
        ...getResourceDetails(resourceUri),
      },
    };

    useFetch.mockReturnValue({
      data: [],
      loading: false,
    });

    policyDispatch = jest.fn();
    resourceDispatch = jest.fn();

    useRouter.mockReturnValue(router);
    const utils = render(<Resource />, {
      resourceState,
      resourceDispatch,
      policyDispatch,
    });
    rerender = utils.rerender;
    unmount = utils.unmount;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should clear the occurrence details on load", () => {
    expect(resourceDispatch).toHaveBeenCalledWith({
      type: "SET_OCCURRENCE_DETAILS",
      data: null,
    });
  });

  it("should clear the current resource on unmount", () => {
    unmount();
    expect(resourceDispatch).toHaveBeenCalledWith({
      type: "SET_CURRENT_RESOURCE",
      data: {},
    });
  });

  it("should not make the fetch call if there is no resource uri specified", () => {
    useFetch.mockClear();
    router.query.resourceUri = null;
    rerender(<Resource />, {
      resourceState,
      resourceDispatch,
      policyDispatch,
    });
    expect(useFetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(null, {
      resourceUri: null,
    });
  });

  it("should call to fetch the occurrences if a uri is specified", () => {
    useFetch.mockReturnValue({});
    render(<Resource />, {
      resourceState,
      resourceDispatch,
      policyDispatch,
    });
    expect(useFetch)
      .toHaveBeenCalledTimes(2)
      .toHaveBeenCalledWith("/api/occurrences", {
        resourceUri: router.query.resourceUri,
      });
  });

  it("should show a loading indicator while fetching the occurrence data", () => {
    useFetch.mockReturnValue({
      loading: true,
    });

    rerender(<Resource />, {
      resourceState,
      resourceDispatch,
      policyDispatch,
    });

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render the resource header information", () => {
    const { resourceName, resourceVersion, resourceLabel } = getResourceDetails(
      router.query.resourceUri
    );

    expect(
      screen.getByText(resourceName, { selector: "h1" })
    ).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText(resourceLabel)).toBeInTheDocument();
    expect(screen.getByText("Version")).toBeInTheDocument();
    expect(
      screen.getByText(resourceVersion.substring(0, 12))
    ).toBeInTheDocument();
  });

  it("should render the button to change the resource version", () => {
    const renderedButton = screen.getByRole("button", {
      name: "Change Version",
    });

    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);

    expect(screen.getByTestId("drawer")).toHaveClass("openDrawer");

    act(() => {
      userEvent.click(screen.getByLabelText(/close drawer/i));
    });
    expect(screen.getByTestId("drawer")).toHaveClass("closedDrawer");
  });

  it("should render a button to use the resource in the policy playground", () => {
    const renderedButton = screen.getByRole("button", {
      name: "Evaluate in Policy Playground",
    });

    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);

    expect(policyDispatch)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        type: "SET_EVALUATION_RESOURCE",
        data: {
          versionedResourceUri: router.query.resourceUri,
        },
      });

    expect(router.push)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("/playground");
  });
});
