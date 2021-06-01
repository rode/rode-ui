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

import Dropdown from "components/Dropdown";

describe("Dropdown", () => {
  let name, label, onChange, options;

  beforeEach(() => {
    name = chance.string();
    label = chance.string();
    onChange = jest.fn();
    options = [{ label: chance.string(), value: chance.string() }];
  });

  it("should render the dropdown with default values", () => {
    render(
      <Dropdown
        name={name}
        label={label}
        onChange={onChange}
        options={options}
      />
    );

    const renderedComponent = screen.getByLabelText(label);

    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent).toHaveAttribute("id", name);
  });

  it("should call the onChange event when changing the value of the dropdown", () => {
    render(
      <Dropdown
        name={name}
        label={label}
        onChange={onChange}
        options={options}
      />
    );

    const renderedComponent = screen.getByLabelText(label);
    userEvent.click(renderedComponent);
    userEvent.type(renderedComponent, options[0].label);
    userEvent.type(renderedComponent, "{enter}");

    expect(onChange).toHaveBeenCalled();
  });

  it("should render the placeholder if specified", () => {
    const placeholder = chance.string();
    render(
      <Dropdown
        name={name}
        label={label}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
      />
    );

    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it("should render the value if specified", () => {
    const value = options[0];
    render(
      <Dropdown
        name={name}
        label={label}
        onChange={onChange}
        value={value}
        options={options}
      />
    );

    expect(screen.getByText(value.label)).toBeInTheDocument();
  });

  it("should allow the user to specify the dropdown as required", () => {
    render(
      <Dropdown
        name={name}
        label={label}
        onChange={onChange}
        required
        placeholder={chance.string()}
        options={options}
      />
    );

    expect(screen.getByText(label)).toHaveClass("required", { exact: false });
  });

  it("should render an error if specified", () => {
    const error = chance.string();
    render(
      <Dropdown
        name={name}
        label={label}
        onChange={onChange}
        error={error}
        options={options}
      />
    );

    const renderedError = screen.getByText(error);
    expect(renderedError).toBeInTheDocument();
    expect(renderedError).toHaveClass("errorMessage");
  });
});
