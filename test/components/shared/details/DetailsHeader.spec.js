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
import DetailsHeader from "components/shared/DetailsHeader";

describe("DetailsHeader", () => {
  let name, subText, actionButtonText;

  beforeEach(() => {
    name = chance.string();
    subText = chance.string();
    actionButtonText = chance.string();

    render(
      <DetailsHeader
        name={name}
        subText={<p>{subText}</p>}
        actionButton={<button>{actionButtonText}</button>}
      />
    );
  });

  it("should render the name", () => {
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it("should render the subtext element", () => {
    const renderedElement = screen.getByText(subText);
    expect(renderedElement).toBeInTheDocument();
  });

  it("should render the action button", () => {
    const renderedElement = screen.getByText(actionButtonText);
    expect(renderedElement).toBeInTheDocument();
  });
});
