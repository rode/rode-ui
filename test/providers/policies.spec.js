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
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PolicyComponent from "test/testing-utils/hook-components/usePoliciesComponent";
import { PoliciesProvider } from "providers/policies";

describe("policies provider", () => {
  let searchTerm;

  beforeEach(() => {
    searchTerm = chance.string();
    render(
      <PoliciesProvider>
        <PolicyComponent newSearchTerm={searchTerm} />
      </PoliciesProvider>
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should render the default state keys", () => {
    expect(screen.getByText(/searchTerm/i)).toBeInTheDocument();
    expect(screen.getByText(/currentPolicy/i)).toBeInTheDocument();
  });

  it("should handle dispatching an action", () => {
    const dispatchButton = screen.getByText(/update search term/i);

    userEvent.click(dispatchButton);

    expect(screen.getByText(/searchTerm:/i)).toHaveTextContent(searchTerm, {
      exact: false,
    });
  });
});
