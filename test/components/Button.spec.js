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
import Button from "components/Button";
import userEvent from "@testing-library/user-event";
import { useTheme } from "providers/theme";
import { DARK_THEME, LIGHT_THEME } from "utils/theme-utils";

jest.mock("providers/theme");

describe("Button", () => {
  let onClick, label;

  beforeEach(() => {
    useTheme.mockReturnValue({
      theme: chance.pickone([LIGHT_THEME, DARK_THEME]),
    });
    onClick = jest.fn();
    label = chance.string();
    console.error = jest.fn();
  });

  it("should render the button with defaults", () => {
    render(<Button onClick={onClick} label={label} />);

    const renderedButton = screen.getByLabelText(label);

    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toHaveTextContent(label);
    expect(renderedButton).toHaveClass("primary");
    expect(renderedButton).not.toBeDisabled();
    expect(screen.queryByTestId("loadingIndicator")).not.toBeInTheDocument();
  });

  it("should call the passed onClick function", () => {
    render(<Button onClick={onClick} label={label} />);

    const renderedButton = screen.getByLabelText(label);

    userEvent.click(renderedButton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should render the children if the button needs to render more than just the label", () => {
    const children = chance.string();

    render(
      <Button onClick={onClick} label={label}>
        {children}
      </Button>
    );

    const renderedButton = screen.getByLabelText(label);

    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toHaveTextContent(children);
  });

  it("should allow a button type of 'icon'", () => {
    render(<Button onClick={onClick} label={label} buttonType={"icon"} />);

    const renderedButton = screen.getByLabelText(label);

    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toHaveClass("icon");
  });

  it("should allow a button type of 'text'", () => {
    render(<Button onClick={onClick} label={label} buttonType={"text"} />);

    const renderedButton = screen.getByLabelText(label);

    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toHaveClass("text");
  });

  it("should render the button as disabled when specified", () => {
    render(<Button onClick={onClick} label={label} disabled={true} />);

    expect(screen.getByLabelText(label)).toBeDisabled();
  });

  it("should require an onClick function for buttons that are not of type submit", () => {
    render(<Button label={label} />);

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("should allow the user to specify additional classes", () => {
    const className = chance.string();
    render(<Button label={label} className={className} />);

    expect(screen.getByLabelText(label)).toHaveClass(className);
  });

  it("should allow the user to pass a loading prop to show the loading indicator", () => {
    render(<Button label={label} onClick={onClick} loading={true} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    expect(screen.getByLabelText(label)).toBeDisabled();
  });

  it("should allow the user to specific a tooltip", () => {
    const tooltip = chance.string();
    render(<Button label={label} onClick={onClick} tooltip={tooltip} />);

    const renderedButton = screen.getByLabelText(label);

    expect(renderedButton).toHaveAttribute("data-tip", "true");
    expect(renderedButton).toHaveAttribute("data-for", `${label}-toolTip`);

    expect(screen.getByText(tooltip)).toBeInTheDocument();
  });
});
