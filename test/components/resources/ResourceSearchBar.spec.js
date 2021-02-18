import React from "react";
import { render, screen } from "@testing-library/react";
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

jest.mock("next/router");

describe("ResourceSearchBar", () => {
  let pushMock;
  beforeEach(() => {
    jest.spyOn(console, "log");
    pushMock = jest.fn();

    useRouter.mockReturnValue({
      push: pushMock,
    });

    render(<ResourceSearchBar />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a resource", () => {
    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });

  it("should render the button to perform a search", () => {
    const renderedSearchButton = screen.getByLabelText("Search");
    const renderedSearchInput = screen.getByText(/search for a resource/i);
    expect(renderedSearchButton).toBeInTheDocument();
    expect(renderedSearchButton).toBeDisabled();

    userEvent.type(renderedSearchInput, chance.character());
    expect(renderedSearchButton).not.toBeDisabled();
  });

  it("should do the thing when the button is clicked", () => {
    const renderedSearchButton = screen.getByLabelText("Search");
    const renderedSearchInput = screen.getByText(/search for a resource/i);
    const searchTerm = chance.string();

    userEvent.type(renderedSearchInput, searchTerm);
    userEvent.click(renderedSearchButton);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(`/resources?search=${searchTerm}`);
  });
});
