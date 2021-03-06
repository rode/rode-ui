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

import TextArea from "components/TextArea";

describe("TextArea", () => {
  let name, label, onChange, rerender;

  beforeEach(() => {
    name = chance.string();
    label = chance.string();
    onChange = jest.fn();
    const utils = render(
      <TextArea name={name} label={label} onChange={onChange} />
    );
    rerender = utils.rerender;
  });

  it("should render the textArea with default values", () => {
    const renderedComponent = screen.getByLabelText(label);

    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent).toHaveAttribute("id", name);
    expect(renderedComponent).toHaveAttribute("placeholder", label);
    expect(renderedComponent).toHaveAttribute("rows", "5");
  });

  it("should call the onChange event", () => {
    const textToType = chance.string();
    const renderedComponent = screen.getByLabelText(label);
    userEvent.type(renderedComponent, textToType);

    expect(onChange).toHaveBeenCalledTimes(textToType.length);
  });

  it("should allow overriding the default number of rows", () => {
    const rowCount = chance.d10();
    rerender(
      <TextArea name={name} label={label} onChange={onChange} rows={rowCount} />
    );

    expect(screen.getByLabelText(label)).toHaveAttribute(
      "rows",
      rowCount.toString()
    );
  });

  it("should render the placeholder if specified", () => {
    const placeholder = chance.string();
    rerender(
      <TextArea
        name={name}
        label={label}
        onChange={onChange}
        placeholder={placeholder}
      />
    );

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it("should render the value if specified", () => {
    const value = chance.string();
    rerender(
      <TextArea name={name} label={label} onChange={onChange} value={value} />
    );

    expect(screen.getByDisplayValue(value)).toBeInTheDocument();
  });

  it("should allow the user to specify the text area as required", () => {
    rerender(
      <TextArea name={name} label={label} onChange={onChange} required />
    );

    expect(screen.getByText(label)).toHaveClass("required", { exact: false });
  });

  it("should allow the user to specify the text area as disabled", () => {
    rerender(<TextArea name={name} label={label} disabled />);
    expect(screen.getByLabelText(label)).toBeDisabled();
  });

  it("should require an onChange event if the text area is not disabled", () => {
    console.error = jest.fn();
    rerender(<TextArea name={name} label={label} />);
    expect(console.error).toHaveBeenCalled();
  });

  it("should render an error if specified", () => {
    const error = chance.string();
    rerender(
      <TextArea name={name} label={label} onChange={onChange} error={error} />
    );

    const renderedError = screen.getByText(error);
    expect(renderedError).toBeInTheDocument();
    expect(renderedError).toHaveClass("errorMessage");
  });
});
