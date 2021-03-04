import React from "react";
import { render, screen } from "test/testing-utils/renderer";
import BuildOccurrenceSection from "components/occurrences/BuildOccurrenceSection";
import { createMockMappedOccurrences } from "test/testing-utils/mocks";

describe("BuildOccurrenceSection", () => {
  let occurrences;

  it("should return null if there are no relevant occurrences", () => {
    occurrences = [];
    render(<BuildOccurrenceSection occurrences={occurrences}/> );

    expect(screen.queryByText(/build/i)).not.toBeInTheDocument();
  });
  describe("build occurrences exist", () => {
    beforeEach(() => {
      const {build} = createMockMappedOccurrences();
      occurrences = build;
      render(<BuildOccurrenceSection occurrences={occurrences}/> );
    });

    it("should render the section title", () => {
      expect(screen.getByText("Build")).toBeInTheDocument();
      expect(screen.getByTitle("Cog")).toBeInTheDocument();
    });

    it("should render a preview for each build occurrence", () => {
      occurrences.forEach((occurrence, index) => {
        const renderedProducedText = screen.queryAllByText(/produced/i);
        expect(renderedProducedText[index]).toBeInTheDocument();
        expect(renderedProducedText[index]).toHaveTextContent(new RegExp("Produced " + occurrence.artifacts.length + " Artifact", "i"));

        const renderedSourceLinks = screen.queryAllByText(/view source/i);
        expect(renderedSourceLinks[index]).toBeInTheDocument();
        expect(renderedSourceLinks[index]).toHaveAttribute("href", occurrence.sourceUri);

        const renderedLogsLinks = screen.queryAllByText(/view logs/i);
        expect(renderedLogsLinks[index]).toBeInTheDocument();
        expect(renderedLogsLinks[index]).toHaveAttribute("href", occurrence.logsUri);
      })
    });
  });
});