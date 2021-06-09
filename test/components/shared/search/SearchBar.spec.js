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
    searchTerm = chance.string();
    const utils = render(
      <SearchBar
        onSubmit={ onSubmit }
        onChange={ onChange }
        label={ label }
        name={ name }
        searchTerm={ searchTerm }
      />
    );
    rerender = utils.rerender;
  });

  it("should render the input for the search bar", () => {
    const renderedInput = screen.getByLabelText(label);
    expect(renderedInput).toBeInTheDocument();
    expect(renderedInput).toHaveValue(searchTerm);

    userEvent.type(renderedInput, chance.character());
    expect(onChange).toHaveBeenCalled();
  });

  it("should render the input with no value if searching for all", () => {
    searchTerm = "all";
    rerender(
      <SearchBar
        onSubmit={ onSubmit }
        onChange={ onChange }
        label={ label }
        name={ name }
        searchTerm={ searchTerm }
      />
    );

    const renderedInput = screen.getByLabelText(label);
    expect(renderedInput).toHaveValue("");
  });

  it("should render the search icon button", () => {
    const renderedButton = screen.getByLabelText(/search/i);
    expect(renderedButton).toBeInTheDocument();
  });

  it("should render the placeholder if specified", () => {
    placeholder = chance.string();
    const renderedInput = screen.getByLabelText(label);
    expect(renderedInput).toHaveAttribute("placeholder", label);

    rerender(
      <SearchBar
        onSubmit={ onSubmit }
        onChange={ onChange }
        label={ label }
        name={ name }
        placeholder={ placeholder }
      />
    );
    expect(renderedInput).toHaveAttribute("placeholder", placeholder);
  });

  it("should render the help text if specified", () => {
    helpText = chance.string();
    rerender(
      <SearchBar
        onSubmit={ onSubmit }
        onChange={ onChange }
        label={ label }
        name={ name }
        helpText={ helpText }
      />
    );

    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  it("should allow the user to override the search button label", () => {
    const buttonLabel = chance.string();
    rerender(
      <SearchBar
        onSubmit={ onSubmit }
        onChange={ onChange }
        label={ label }
        name={ name }
        buttonLabel={ buttonLabel }
      />
    );
    const renderedButton = screen.getByLabelText(buttonLabel);
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton.type).toBe("submit");
  });

  it("should allow the user to pass an onblur function", () => {
    const onBlur = jest.fn();
    const triggerBlur = chance.string();
    rerender(
      <>
        <p>{triggerBlur}</p>
        <SearchBar
          onSubmit={ onSubmit }
          onChange={ onChange }
          label={ label }
          name={ name }
          onBlur={ onBlur }
        />
      </>
    );

    const renderedInput = screen.getByLabelText(label);
    userEvent.click(renderedInput);
    userEvent.click(screen.getByText(triggerBlur));

    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
