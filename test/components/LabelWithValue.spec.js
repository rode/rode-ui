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
import LabelWithValue from "components/LabelWithValue";

describe("LabelWithValue", () => {
  let label, value, rerender;

  beforeEach(() => {
    label = chance.string();
    value = chance.string();

    const utils = render(<LabelWithValue label={label} value={value} />);
    rerender = utils.rerender;
  });

  it("should render the label", () => {
    const renderedLabel = screen.getByText(label);
    expect(renderedLabel).toBeInTheDocument();
    expect(renderedLabel).toHaveClass("body1");
  });

  it("should render the value", () => {
    const renderedValue = screen.getByText(value);
    expect(renderedValue).toBeInTheDocument();
    expect(renderedValue).toHaveClass("value");
  });

  it("should return null if there is no value specified", () => {
    rerender(<LabelWithValue label={label} value={null} />);

    expect(screen.queryByText(label)).not.toBeInTheDocument();
  });

  it("should allow the user to specify additional classes to the paragraph container", () => {
    const className = chance.string();
    rerender(
      <LabelWithValue label={label} value={value} className={className} />
    );

    const renderedLabel = screen.getByText(label);
    expect(renderedLabel.closest("p")).toHaveClass(className);
  });

  it("should allow the user to specify a vertical layout of the component", () => {
    rerender(<LabelWithValue label={label} value={value} vertical />);

    const renderedLabel = screen.getByText(label);
    expect(renderedLabel.closest("p")).toHaveClass(
      "verticalLabelWithValueContainer"
    );
  });

  it("should allow the user to specify a different html tag to render", () => {
    const type = "h1";
    rerender(<LabelWithValue label={label} value={value} as={type} />);

    const renderedLabel = screen.getByText(label);
    expect(renderedLabel).toBeInTheDocument();
    expect(renderedLabel.closest(type)).toHaveClass("labelWithValueContainer");
  });
});
