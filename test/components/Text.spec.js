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
import Text from "components/Text";

describe("Text", () => {
  let children;

  beforeEach(() => {
    children = chance.string();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should pass additional classes to the underlying component", () => {
    const additionalClass = chance.string();
    render(<Text.Label className={additionalClass}>{children}</Text.Label>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass(additionalClass);
  });

  it("should pass additional props to the underlying component", () => {
    const propValue = chance.string({ alpha: true });
    render(<Text.Label hello={propValue}>{children}</Text.Label>);

    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveAttribute("hello", propValue);
  });

  it("should render the primary Heading", () => {
    render(<Text.Heading1>{children}</Text.Heading1>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass("heading1");
  });

  it("should render the secondary Heading", () => {
    render(<Text.Heading2>{children}</Text.Heading2>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass("heading2");
  });

  it("should render the third Heading", () => {
    render(<Text.Heading3>{children}</Text.Heading3>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass("heading3");
  });

  it("should render the Label", () => {
    render(<Text.Label>{children}</Text.Label>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass("label");
  });

  it("should render the Value", () => {
    render(<Text.Value>{children}</Text.Value>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass("value");
  });

  it("should render the primary Body text", () => {
    render(<Text.Body1>{children}</Text.Body1>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass("body1");
  });

  it("should render the secondary Body text", () => {
    render(<Text.Body2>{children}</Text.Body2>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass("body2");
  });

  it("should render the caption", () => {
    render(<Text.Caption>{children}</Text.Caption>);
    const rendered = screen.getByText(children);
    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveClass("caption");
  });
});
