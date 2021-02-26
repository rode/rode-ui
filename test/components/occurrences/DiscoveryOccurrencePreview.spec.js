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
