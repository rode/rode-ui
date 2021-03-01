import React from "react";
import { render, screen } from "@testing-library/react";
import FetchComponent from "test/testing-utils/useFetchComponent";
import useSWR from "swr";

jest.mock("swr");

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

    expect(useSWR).toHaveBeenCalledWith(url, expect.any(Function));
  });

  it("should use SWR to fetch data with a specified query", () => {
    render(<FetchComponent url={url} query={query} />);

    expect(useSWR).toHaveBeenCalledWith(
      `${url}?${new URLSearchParams(query)}`,
      expect.any(Function)
    );
  });

  it("should pass null as the URL when it is not specified", () => {
    render(<FetchComponent url={null} query={null} />);

    expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function));
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
