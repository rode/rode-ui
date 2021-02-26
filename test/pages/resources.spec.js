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
import Resources from "pages/resources";
import { useRouter } from "next/router";
import useSWR from "swr";

jest.mock("next/router");
jest.mock("swr");

describe("Resources", () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      query: {},
    });

    useSWR.mockReturnValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a resource", () => {
    render(<Resources />);

    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });

  describe("search results", () => {
    let resources, expectedSearch;

    beforeEach(() => {
      resources = chance.n(
        () => ({
          uri: `${chance.url()}@${chance.word()}`,
        }),
        chance.d4()
      );
      expectedSearch = chance.word();
      useRouter.mockReturnValue({
        query: {
          search: expectedSearch,
        },
      });
      useSWR.mockReturnValue({ data: resources });
    });

    it("should pass the search term through as a filter", () => {
      const expectedUri = `/api/resources?filter=${encodeURIComponent(
        expectedSearch
      )}`;

      render(<Resources />);

      expect(useSWR)
        .toHaveBeenCalledTimes(2)
        .toHaveBeenCalledWith(expectedUri, expect.any(Function));
    });

    it("should render all of the search results", () => {
      render(<Resources />);

      resources.forEach((resource) => {
        const [resourceName] = resource.uri.split("@");
        expect(
          screen.getByText(resourceName, { exact: false })
        ).toBeInTheDocument();
      });
    });

    it("should render a message when there are no results", () => {
      useSWR.mockReturnValue({ data: [] });

      render(<Resources />);

      expect(screen.getByText("No resources found")).toBeInTheDocument();
    });
  });
});
