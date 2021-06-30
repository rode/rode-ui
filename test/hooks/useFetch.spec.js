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
import FetchComponent from "test/testing-utils/hook-components/useFetchComponent";
import useSWR from "swr";
import { fetcher } from "utils/hook-utils";

jest.mock("swr");
jest.mock("utils/hook-utils");

describe("useFetch", () => {
  let url, query;

  beforeEach(() => {
    url = chance.url();
    query = { [chance.string()]: chance.string() };

    useSWR.mockReturnValue({
      data: chance.string(),
      error: null,
    });
  });

  it("should use SWR to fetch data with no query", () => {
    render(<FetchComponent url={url} query={null} />);

    expect(useSWR).toHaveBeenCalledWith(url, fetcher, {
      revalidateOnFocus: false,
    });
  });

  it("should use SWR to fetch data with a specified query", () => {
    render(<FetchComponent url={url} query={query} />);

    expect(useSWR).toHaveBeenCalledWith(
      `${url}?${new URLSearchParams(query)}`,
      fetcher,
      { revalidateOnFocus: false }
    );
  });

  it("should pass null as the URL when it is not specified", () => {
    render(<FetchComponent url={null} query={null} />);

    expect(useSWR).toHaveBeenCalledWith(null, fetcher, {
      revalidateOnFocus: false,
    });
  });

  it("should pass null as the URL when it is not specified but a query is provided", () => {
    render(<FetchComponent url={null} query={query} />);

    expect(useSWR).toHaveBeenCalledWith(null, fetcher, {
      revalidateOnFocus: false,
    });
  });

  it("should return the data if the call was successful", () => {
    render(<FetchComponent url={url} query={query} />);

    expect(screen.getByText(/data:/i)).toBeInTheDocument();
  });

  it("should return the error if an error occurs during the call", () => {
    useSWR.mockReturnValue({
      data: null,
      error: chance.string(),
    });

    render(<FetchComponent url={url} query={query} />);

    expect(screen.getByText(/error:/i)).toBeInTheDocument();
  });

  it("should return loading while the call is being made", () => {
    useSWR.mockReturnValue({
      data: null,
      error: null,
    });

    render(<FetchComponent url={url} query={query} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
