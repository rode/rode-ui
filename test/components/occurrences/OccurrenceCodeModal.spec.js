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
import OccurrenceCodeModal from "components/occurrences/OccurrenceCodeModal";
import { useResources } from "providers/resources";
import { copy } from "utils/shared-utils";

jest.mock("providers/resources");
jest.mock("utils/shared-utils");

describe("OccurrenceCodeModal", () => {
  let occurrence, scrollMock;

  beforeEach(() => {
    occurrence = createMockOccurrence();
    scrollMock = jest.fn();

    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: scrollMock,
    });

    useResources.mockReturnValue({
      state: {},
    });

    render(<OccurrenceCodeModal json={occurrence} />);
  });

  it("should render the button to toggle the code block", () => {
    expect(screen.getByText(/show json/i)).toBeInTheDocument();
  });

  it("should show the code block when appropriate", () => {
    userEvent.click(screen.getByText(/show json/i));
    expect(screen.getByTestId("occurrenceJson")).toBeInTheDocument();
    expect(screen.getByText("Occurrence JSON")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy to Clipboard" })
    ).toBeInTheDocument();

    userEvent.click(screen.getByLabelText(/close modal/i));
    expect(screen.queryByTestId("occurrenceJson")).not.toBeInTheDocument();
    expect(screen.queryByTestId("Occurrence JSON")).not.toBeInTheDocument();
  });

  it("should copy the text to the clipboard when prompted", () => {
    userEvent.click(screen.getByText(/show json/i));
    userEvent.click(screen.getByRole("button", { name: "Copy to Clipboard" }));

    expect(copy).toHaveBeenCalledWith(JSON.stringify(occurrence, null, 2));
  });
});
