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
