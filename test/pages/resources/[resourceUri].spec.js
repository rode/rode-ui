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
import Resource from "pages/resources/[resourceUri]";
import { useRouter } from "next/router";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";
import userEvent from "@testing-library/user-event";

jest.mock("next/router");

describe("Resource Details page", () => {
  let resourceState, router, policyDispatch, resourceDispatch, unmount;

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

    policyDispatch = jest.fn();
    resourceDispatch = jest.fn();

    useRouter.mockReturnValue(router);
    const utils = render(<Resource />, {
      resourceState,
      resourceDispatch,
      policyDispatch,
    });
    unmount = utils.unmount;
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
      data: null,
    });
  });

  it("should render the resource header information", () => {
    const { resourceName, resourceVersion, resourceType } = getResourceDetails(
      router.query.resourceUri
    );

    expect(screen.getByText(resourceName)).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText(resourceType)).toBeInTheDocument();
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

    expect(
      screen.getByText(/no versions found matching the resource/i)
    ).toBeInTheDocument();
  });

  it("should render a button to use the resource in the policy playground", () => {
    const { resourceName, resourceVersion, resourceType } = getResourceDetails(
      router.query.resourceUri
    );

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
          uri: router.query.resourceUri,
          name: resourceName,
          version: resourceVersion,
          type: resourceType,
        },
      });

    expect(router.push)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("/playground");
  });
});
