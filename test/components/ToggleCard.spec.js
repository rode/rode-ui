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
import { render, screen, act } from "@testing-library/react";
import ToggleCard from "components/ToggleCard";
import userEvent from "@testing-library/user-event";

describe("ToggleCard", () => {
  let header, content, className, rerender;

  beforeEach(() => {
    header = <p data-testid={"header"}>{chance.string()}</p>;
    content = <p data-testid={"content"}>{chance.string()}</p>;
    className = chance.string({ alpha: true });

    const utils = render(<ToggleCard header={header} content={content} />);
    rerender = utils.rerender;
  });

  it("should show the header contents", () => {
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("should render the toggle icon", () => {
    const renderedIcon = screen.getByTitle(/chevron right/i);
    expect(renderedIcon).toBeInTheDocument();
    expect(renderedIcon.closest("span")).toHaveClass("toggleIcon");
  });

  it("should show the contents of the card when prompted", () => {
    const renderedHeader = screen.getByTestId("header");

    act(() => {
      userEvent.click(renderedHeader);
    });

    expect(screen.getByTitle(/chevron right/i).closest("span")).toHaveClass(
      "toggleIconExpanded"
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("should allow the user to specify additional classes to the card", () => {
    rerender(
      <ToggleCard header={header} content={content} className={className} />
    );

    expect(screen.getByTestId("toggleCard")).toHaveClass(className);
  });
});
