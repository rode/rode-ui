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
import ResourceSearchResult from "components/resources/ResourceSearchResult";
import { useRouter } from "next/router";
import { createMockResourceUri } from "test/testing-utils/mocks";

jest.mock("next/router");

describe("ResourceSearchResult", () => {
  let searchResult, resourceName, version, type, pushMock;

  beforeEach(() => {
    resourceName = chance.string();
    version = chance.string({ min: 12 });
    searchResult = {
      uri: createMockResourceUri(resourceName, version),
    };
    type = "Docker";
    pushMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    render(<ResourceSearchResult searchResult={searchResult} />);
  });

  it("should render the resource details", () => {
    expect(screen.getByText("Resource Name")).toBeInTheDocument();
    expect(screen.getByText(resourceName)).toBeInTheDocument();
    expect(screen.getByText("Version")).toBeInTheDocument();
    expect(
      screen.getByText(version.substring(0, 12), { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText(type)).toBeInTheDocument();
  });

  it("should render a view resources button ", () => {
    const renderedButton = screen.getByText("View Resource");

    expect(renderedButton).toBeInTheDocument();

    userEvent.click(renderedButton);
    expect(pushMock).toHaveBeenCalledWith(
      `/resources/${encodeURIComponent(searchResult.uri)}`
    );
  });
});
