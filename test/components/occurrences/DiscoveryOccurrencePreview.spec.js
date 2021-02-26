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
import { createMockOccurrence } from "test/testing-utils/mocks";
import DiscoveryOccurrencePreview from "components/occurrences/DiscoveryOccurrencePreview";

describe("DiscoveryOccurrencePreview", () => {
  let occurrence;

  beforeEach(() => {
    occurrence = createMockOccurrence("DISCOVERY");

    render(<DiscoveryOccurrencePreview occurrence={occurrence} />);
  });

  it("should show the analysis status for the occurrence", () => {
    expect(
      screen.getByText(
        `Analysis Status: ${occurrence.discovered.discovered.analysisStatus}`
      )
    ).toBeInTheDocument();
  });
});
