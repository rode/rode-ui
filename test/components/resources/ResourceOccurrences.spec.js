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
import { createMockMappedOccurrences } from "test/testing-utils/mocks";
import ResourceOccurrences from "components/resources/ResourceOccurrences";

jest.mock("hooks/useFetch");

describe("ResourceOccurrences", () => {
  let occurrences, policyState;

  beforeEach(() => {
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: jest.fn(),
    });
    occurrences = createMockMappedOccurrences();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("showing occurrence previews", () => {
    beforeEach(() => {
      policyState = {
        occurrenceDetails: null,
      };
      render(<ResourceOccurrences occurrences={occurrences} />, {
        policyState,
      });
    });

    it("should render the build occurrence section", () => {
      expect(screen.getByText("Build")).toBeInTheDocument();
      expect(screen.getByTitle("Cog")).toBeInTheDocument();
    });

    it("should render the secure occurrence section", () => {
      expect(screen.getByText("Secure")).toBeInTheDocument();
      expect(screen.getByTitle("Shield Check")).toBeInTheDocument();
    });

    it("should render the deployment occurrence section", () => {
      expect(screen.getByText("Deploy")).toBeInTheDocument();
      expect(screen.getByTitle("Server")).toBeInTheDocument();
    });

    it("should not render the occurrence details", () => {
      expect(screen.queryByTestId("occurrenceDetails")).not.toBeInTheDocument();
    });
  });

  it("should render the occurrence details if they should be shown", () => {
    policyState.occurrenceDetails = occurrences.build[0];

    render(<ResourceOccurrences occurrences={occurrences} />, {
      policyState,
    });

    expect(screen.getByTestId("occurrenceDetails")).toBeInTheDocument();
  });
});
