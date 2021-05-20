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
import userEvent from "@testing-library/user-event";
import SelectedResource from "components/playground/SelectedResource";
import { useFetch } from "hooks/useFetch";

jest.mock("hooks/useFetch");

describe("SelectedResource", () => {
  let resource, clearResource, fetchResponse;

  beforeEach(() => {
    resource = {
      name: chance.string(),
      version: chance.string({ min: 12 }),
      type: chance.string(),
      uri: chance.string(),
    };
    fetchResponse = {
      data: {
        originals: chance.string(),
      },
      loading: false,
    };

    clearResource = jest.fn();
    useFetch.mockReturnValue(fetchResponse);

    render(
      <SelectedResource resource={resource} clearResource={clearResource} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the resource name", () => {
    expect(screen.getByText(resource.name)).toBeInTheDocument();
  });

  it("should render the button to clear the resource", () => {
    const renderedButton = screen.getByRole("button", {
      name: "Clear Resource",
    });

    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);
    expect(clearResource).toHaveBeenCalledTimes(1);
  });

  it("should call to fetch the occurrence data when a resource is selected", () => {
    expect(useFetch)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("/api/occurrences", {
        resourceUri: resource.uri,
      });
  });

  it("should render a button to toggle the resource details", () => {
    const renderedButton = screen.getByRole("button", {
      name: "Show Resource Details",
    });

    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);

    expect(
      screen.getByText(resource.version.substring(0, 12))
    ).toBeInTheDocument();
    expect(screen.getByText(resource.type)).toBeInTheDocument();
    expect(screen.getByText(/occurrence data/i)).toBeInTheDocument();
    expect(
      screen.getByText(JSON.stringify(fetchResponse.data.originals, null, 2))
    ).toBeInTheDocument();
  });
});
