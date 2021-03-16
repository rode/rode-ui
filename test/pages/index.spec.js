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

import { render, screen } from "test/testing-utils/renderer";
import React from "react";

import Home from "pages/index";

describe("index", () => {
  let searchTerm;
  beforeEach(() => {
    searchTerm = chance.string();
    render(<Home />, {
      resourceState: {
        searchTerm,
      },
      policyState: {
        searchTerm,
      },
    });
  });

  it("should clear any saved search terms", () => {
    const [resourceSearch, policySearch] = screen.queryAllByLabelText(
      /search for a/i
    );

    console.log("resourceSearch", resourceSearch);

    expect(resourceSearch).toHaveDisplayValue("");
    expect(policySearch).toHaveDisplayValue("");
    expect(screen.queryByText(searchTerm)).not.toBeInTheDocument();
  });

  it("should render a card for resources", () => {
    const expected = "Search for a resource";
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("should render a card for policies", () => {
    const expected = "Search for a policy";
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
