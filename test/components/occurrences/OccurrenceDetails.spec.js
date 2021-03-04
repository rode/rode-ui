import React from "react";
import { render, screen } from "test/testing-utils/renderer";
import OccurrenceDetails from "components/occurrences/OccurrenceDetails";
import { createMockMappedOccurrences } from "test/testing-utils/mocks";

describe("OccurrenceDetails", () => {
  let mappedOccurrences;

  beforeEach(() => {
    mappedOccurrences = createMockMappedOccurrences();
  });

  it("should render the occurrence code block button on any occurrence type", () => {
    const randomOccurrence = chance.pickone(Object.keys(mappedOccurrences));
    render(
      <OccurrenceDetails occurrence={mappedOccurrences[randomOccurrence][0]} />
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

    expect(screen.getByText(/deployment/i)).toBeInTheDocument();
  });
});
