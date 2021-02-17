import React from "react";
import { render, screen } from "@testing-library/react";
import ResourceSearch from "components/resources/ResourceSearch";
import userEvent from "@testing-library/user-event";

describe("ResourceSearch", () => {
  beforeEach(() => {
    jest.spyOn(console, "log");
    render(<ResourceSearch />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render an input for searching for a resource", () => {
    expect(screen.getByText(/search for a resource/i)).toBeInTheDocument();
  });

  it("should call the onChange when typing in the search bar", () => {
    const renderedSearchInput = screen.getByText(/search for a resource/i);

    userEvent.type(renderedSearchInput, chance.character());
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it("should render a button to start the search", () => {
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("should do the thing when the button is clicked", () => {
    const renderedSearchButton = screen.getByLabelText("Search");

    userEvent.click(renderedSearchButton);
    expect(console.log).toHaveBeenCalledTimes(1);
  });
});
