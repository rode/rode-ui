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
import { createMockOccurrence } from "test/testing-utils/mocks";
import OccurrenceCodeBlock from "components/occurrences/OccurrenceCodeBlock";

describe("OccurrenceCodeBlock", () => {
  let occurrence;

  beforeEach(() => {
    occurrence = createMockOccurrence();

    render(<OccurrenceCodeBlock occurrence={occurrence} />);
  });

  it("should render the button to toggle the code block", () => {
    expect(screen.getByText(/show json/i)).toBeInTheDocument();
  });

  it("should show the code block when appropriate", () => {
    userEvent.click(screen.getByText(/show json/i));
    expect(screen.getByTestId("occurrenceJson")).toBeInTheDocument();

    userEvent.click(screen.getByText(/hide json/i));
    expect(screen.queryByTestId("occurrenceJson")).not.toBeInTheDocument();
  });
});
