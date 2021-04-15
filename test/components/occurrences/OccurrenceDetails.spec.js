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
import OccurrenceDetails from "components/occurrences/OccurrenceDetails";
import { createMockMappedOccurrences } from "test/testing-utils/mocks";

describe("OccurrenceDetails", () => {
  let mappedOccurrences, scrollMock;

  beforeEach(() => {
    mappedOccurrences = createMockMappedOccurrences();
    scrollMock = jest.fn();
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: scrollMock,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should scroll to the details when on a mobile device", () => {
    window.innerWidth = 767;
    const randomOccurrenceType = chance.pickone(["build", "secure", "deploy"]);
    render(
      <OccurrenceDetails
        occurrence={mappedOccurrences[randomOccurrenceType][0]}
      />
    );

    expect(scrollMock)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("should not scroll to the details when on a tablet or larger screened device", () => {
    window.innerWidth = 768;
    const randomOccurrenceType = chance.pickone(["build", "secure", "deploy"]);
    render(
      <OccurrenceDetails
        occurrence={mappedOccurrences[randomOccurrenceType][0]}
      />
    );

    expect(scrollMock).not.toHaveBeenCalled();
  });

  it("should render the occurrence code block button on any occurrence type", () => {
    const randomOccurrenceType = chance.pickone(["build", "secure", "deploy"]);
    render(
      <OccurrenceDetails
        occurrence={mappedOccurrences[randomOccurrenceType][0]}
      />
    );

    expect(screen.getByText(/show json/i)).toBeInTheDocument();
  });

  it("should show the build occurrence details if a build occurrence is selected", () => {
    render(<OccurrenceDetails occurrence={mappedOccurrences.build[0]} />);

    expect(screen.getByText(/view source/i)).toBeInTheDocument();
  });

  it("should show the vulnerability occurrence details if a vulnerability scan is selected", () => {
    render(<OccurrenceDetails occurrence={mappedOccurrences.secure[0]} />);

    expect(screen.getByText(/vulnerabilities/i)).toBeInTheDocument();
  });

  it("should show the deployment occurrence details if a deployment occurrence is selected", () => {
    render(<OccurrenceDetails occurrence={mappedOccurrences.deploy[0]} />);

    expect(screen.queryAllByText(/deployment/i)[0]).toBeInTheDocument();
  });
});
