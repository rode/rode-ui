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
import PaginatedFetchComponent from "test/testing-utils/hook-components/usePaginatedFetchComponent";
import { useSWRInfinite } from "swr";
import userEvent from "@testing-library/user-event";
import { fetcher, getPaginatedUrlKey } from "utils/hook-utils";

jest.mock("swr");
jest.mock("utils/hook-utils");

describe("usePaginatedFetch", () => {
  let url, query, pageSize, data, size, setSizeMock, expectedKey;

  beforeEach(() => {
    url = chance.url();
    query = { [chance.string()]: chance.string() };
    pageSize = chance.d10();
    data = [
      {
        data: chance.n(
          () => ({
            name: `${chance.first()} ${chance.last()}`,
          }),
          chance.d6()
        ),
        pageToken: chance.string(),
      },
      {
        [chance.string()]: chance.string(),
        pageToken: chance.string(),
      },
    ];
    size = chance.d4();
    setSizeMock = jest.fn();

    getPaginatedUrlKey.mockReturnValue(expectedKey);

    useSWRInfinite.mockReturnValue({
      data,
      error: null,
      size,
      setSize: setSizeMock,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should use SWRInfinite to fetch data", () => {
    render(
      <PaginatedFetchComponent url={url} query={query} pageSize={pageSize} />
    );

    expect(useSWRInfinite).toHaveBeenCalledWith(expect.any(Function), fetcher);
  });

  it("should return the formatted data if the call was successful", () => {
    render(
      <PaginatedFetchComponent url={url} query={query} pageSize={pageSize} />
    );

    data[0].data.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
    expect(screen.queryByText(/last page/i)).not.toBeInTheDocument();
  });

  it("should return the last page when reaching the last page of results", () => {
    useSWRInfinite.mockReturnValue({
      data: [
        {
          data: [
            {
              [chance.string()]: chance.string(),
            },
          ],
          pageToken: "",
        },
      ],
    });
    render(
      <PaginatedFetchComponent url={url} query={query} pageSize={pageSize} />
    );

    expect(screen.getByText(/last page/i)).toBeInTheDocument();
  });

  it("should give the user a way to get the next page of data", () => {
    render(
      <PaginatedFetchComponent url={url} query={query} pageSize={pageSize} />
    );

    userEvent.click(screen.getByRole("button", { name: "Next page please" }));
    expect(setSizeMock)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(size + 1);
  });

  it("should return the error if an error occurs during the call", () => {
    useSWRInfinite.mockReturnValue({
      error: chance.string(),
    });

    render(
      <PaginatedFetchComponent url={url} query={query} pageSize={pageSize} />
    );

    expect(screen.getByText(/error:/i)).toBeInTheDocument();
  });

  it("should return loading while the call is being made", () => {
    useSWRInfinite.mockReturnValue({
      data: null,
      error: null,
    });

    render(
      <PaginatedFetchComponent url={url} query={query} pageSize={pageSize} />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
