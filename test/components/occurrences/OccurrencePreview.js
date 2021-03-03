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
import { cleanup, render, screen } from "@testing-library/react";
import OccurrencePreview from "components/occurrences/OccurrencePreview";
import dayjs from "dayjs";
import { createMockOccurrence } from "test/testing-utils/mocks";

jest.mock("dayjs");

describe("OccurrencePreview", () => {
  let occurrence, rerender;

  beforeEach(() => {
    occurrence = createMockOccurrence();

    dayjs.mockReturnValue({
      format: jest.fn().mockReturnValue(occurrence.createTime),
    });
    const utils = render(<OccurrencePreview occurrence={occurrence} />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should render the shared occurrence details", () => {
    expect(screen.getByText(occurrence.kind)).toBeInTheDocument();
    expect(
      screen.getByText(`Created at ${occurrence.createTime}`, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText(/show json/i)).toBeInTheDocument();
  });

  it("should render the vulnerability details if the occurrence type is vulnerability", () => {
    occurrence = createMockOccurrence("VULNERABILITY");
    rerender(<OccurrencePreview occurrence={occurrence} />);

    expect(screen.getByText(/effective severity:/i)).toBeInTheDocument();
  });

  it("should render the discovery details if the occurrence type is discovery", () => {
    occurrence = createMockOccurrence("DISCOVERY");
    rerender(<OccurrencePreview occurrence={occurrence} />);

    expect(screen.getByText(/analysis status:/i)).toBeInTheDocument();
  });

  it("should render the build details if the occurrence type is build", () => {
    occurrence = createMockOccurrence("BUILD");
    rerender(<OccurrencePreview occurrence={occurrence} />);

    expect(screen.getByText(/build id:/i)).toBeInTheDocument();
  });
});
