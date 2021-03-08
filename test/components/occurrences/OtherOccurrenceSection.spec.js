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
import { render, screen } from "test/testing-utils/renderer";
import OtherOccurrenceSection from "components/occurrences/OtherOccurrenceSection";
import dayjs from "dayjs";

jest.mock("dayjs");

describe("OtherOccurrenceSection", () => {
  let occurrences, expectedTimestamp;

  beforeEach(() => {
    expectedTimestamp = chance.timestamp();
    dayjs.mockReturnValue({
      format: jest.fn().mockReturnValue(expectedTimestamp),
    });
  });

  it("should return null if there are no relevant occurrences", () => {
    occurrences = [];
    render(<OtherOccurrenceSection occurrences={occurrences} />);

    expect(screen.queryByText(/build/i)).not.toBeInTheDocument();
  });

  describe("other occurrences exist", () => {
    beforeEach(() => {
      occurrences = chance.n(
        () => ({
          kind: chance.string(),
          name: chance.string(),
          createTime: chance.timestamp(),
        }),
        chance.d4()
      );
      render(<OtherOccurrenceSection occurrences={occurrences} />);
    });

    it("should render the section title", () => {
      expect(screen.getByText("Other")).toBeInTheDocument();
      expect(screen.getByTitle("Flag")).toBeInTheDocument();
    });

    it("should render a preview for each build occurrence", () => {
      occurrences.forEach((occurrence, index) => {
        expect(screen.getByText(occurrence.kind)).toBeInTheDocument();

        const renderedProducedText = screen.queryAllByText(/created at/i);
        expect(renderedProducedText[index]).toBeInTheDocument();
        expect(renderedProducedText[index]).toHaveTextContent(
          new RegExp("Created at " + expectedTimestamp, "i")
        );

        const showJsonButton = screen.queryAllByText(/show json/i);
        expect(showJsonButton[index]).toBeInTheDocument();
      });
    });
  });
});
