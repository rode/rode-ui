import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "components/shared/search/SearchBar";

describe("SearchBar", () => {
  let onSubmit,
    onChange,
    searchTerm,
    label,
    name,
    placeholder,
    helpText,
    rerender;

  beforeEach(() => {
    onSubmit = jest.fn();
    onChange = jest.fn();
    label = chance.string();
    name = chance.string();
    const utils = render(
      <SearchBar
        onSubmit={onSubmit}
        onChange={onChange}
        label={label}
        name={name}
      />
    );
    rerender = utils.rerender;
  });

  it("should render the input for the search bar", () => {
    const renderedInput = screen.getByLabelText(label);
    expect(renderedInput).toBeInTheDocument();

    userEvent.type(renderedInput, chance.character());
    expect(onChange).toHaveBeenCalled();
  });

  it("should render the search icon button", () => {
    searchTerm = chance.string();

    const renderedButton = screen.getByLabelText(/search/i);
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toBeDisabled();

    rerender(
      <SearchBar
        onSubmit={onSubmit}
        onChange={onChange}
        label={label}
        name={name}
        searchTerm={searchTerm}
      />
    );
    expect(renderedButton).not.toBeDisabled();
  });

  it("should render the placeholder if specified", () => {
    placeholder = chance.string();
    const renderedInput = screen.getByLabelText(label);
    expect(renderedInput).toHaveAttribute("placeholder", label);

    rerender(
      <SearchBar
        onSubmit={onSubmit}
        onChange={onChange}
        label={label}
        name={name}
        placeholder={placeholder}
      />
    );
    expect(renderedInput).toHaveAttribute("placeholder", placeholder);
  });

  it("should render the help text if specified", () => {
    helpText = chance.string();
    rerender(
      <SearchBar
        onSubmit={onSubmit}
        onChange={onChange}
        label={label}
        name={name}
        helpText={helpText}
      />
    );

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });
});