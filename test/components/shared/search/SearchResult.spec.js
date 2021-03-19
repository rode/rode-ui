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
import SearchResult from "components/shared/search/SearchResult";

describe("SearchBar", () => {
  let mainText, subText, actionButtonText;

  beforeEach(() => {
    mainText = chance.sentence();
    subText = chance.sentence();
    actionButtonText = chance.string();
    render(
      <SearchResult
        mainText={mainText}
        subText={subText}
        actionButton={<button type={"button"}>{actionButtonText}</button>}
      />
    );
  });

  it("should render the main text", () => {
    const renderedText = screen.getByText(mainText);
    expect(renderedText).toBeInTheDocument();
  });

  it("should render the sub text", () => {
    const renderedText = screen.getByText(subText);
    expect(renderedText).toBeInTheDocument();
  });

  it("should render the action button", () => {
    const renderedButton = screen.getByText(actionButtonText);
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton.type).toBe("button");
  });
});
