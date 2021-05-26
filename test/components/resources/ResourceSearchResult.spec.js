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
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResourceSearchResult from "components/resources/ResourceSearchResult";
import { useRouter } from "next/router";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { showError } from "utils/toast-utils";

jest.mock("next/router");
jest.mock("utils/toast-utils");

describe("ResourceSearchResult", () => {
  let searchResult, fetchResponse, versionResponse, pushMock;

  beforeEach(() => {
    searchResult = {
      id: chance.string(),
      name: chance.string(),
      type: chance.pickone(["DOCKER", "GIT", "NPM"]),
    };
    pushMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    versionResponse = {
      data: [{ versionedResourceUri: createMockResourceUri() }],
    };
    fetchResponse = {
      json: jest.fn().mockResolvedValue(versionResponse),
    };
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockResolvedValue(fetchResponse);
    render(<ResourceSearchResult searchResult={searchResult} />);
  });

  it("should render the resource details", () => {
    expect(screen.getByText("Resource Name")).toBeInTheDocument();
    expect(screen.getByText(searchResult.name)).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText(searchResult.type)).toBeInTheDocument();
  });

  it("should render a view resource button ", async () => {
    const renderedButton = screen.getByText("View Resource");

    expect(renderedButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(renderedButton);
    });
    expect(fetch)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(
        `/api/resource-versions?id=${encodeURIComponent(
          searchResult.id
        )}&pageSize=1`
      );
    expect(pushMock).toHaveBeenCalledWith(
      `/resources/${encodeURIComponent(
        versionResponse.data[0].versionedResourceUri
      )}`
    );
  });

  it("should show an error toast if an error occurs when selecting the resource", async() => {
    fetchResponse.json = null;
    const renderedButton = screen.getByText("View Resource");

    expect(renderedButton).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(renderedButton);
    });
    expect(showError).toHaveBeenCalledTimes(1).toHaveBeenCalledWith("An unexpected error has occurred.");
  });
});
