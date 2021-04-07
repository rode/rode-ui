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
import PlaygroundSearchResult from "components/playground/PlaygroundSearchResult";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("utils/resource-utils");

describe("PlaygroundSearchResult", () => {
  let mainText,
    subText,
    buttonText,
    onClick,
    selected,
    resourceDetails,
    rerender;

  beforeEach(() => {
    onClick = jest.fn();
    selected = chance.bool();
    mainText = chance.string();
    subText = chance.string();
    buttonText = chance.string();
    resourceDetails = {
      resourceName: chance.string(),
      resourceVersion: chance.string(),
    };

    getResourceDetails.mockReturnValue(resourceDetails);

    const utils = render(
      <PlaygroundSearchResult
        mainText={mainText}
        subText={subText}
        buttonText={buttonText}
        onClick={onClick}
        selected={selected}
      />
    );

    rerender = utils.rerender;
  });

  it("should render the main text", () => {
    expect(screen.getByText(mainText)).toBeInTheDocument();
  });

  it("should render the sub text", () => {
    expect(screen.getByText(subText)).toBeInTheDocument();
  });

  it("should render the button text when the result is not selected for evaluation", () => {
    rerender(
      <PlaygroundSearchResult
        mainText={mainText}
        subText={subText}
        buttonText={buttonText}
        onClick={onClick}
        selected={false}
      />
    );

    const renderedButton = screen.getByRole("button", { name: buttonText });
    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should render the correct button text when the search result has been selected for evaluation", () => {
    rerender(
      <PlaygroundSearchResult
        mainText={mainText}
        subText={subText}
        buttonText={buttonText}
        onClick={onClick}
        selected={true}
      />
    );

    const renderedButton = screen.getByRole("button", { name: "Selected" });
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toBeDisabled();
    expect(screen.getByTitle(/check/i)).toBeInTheDocument();
  });
});
