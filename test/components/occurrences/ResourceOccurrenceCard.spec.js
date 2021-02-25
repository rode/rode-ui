import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import ResourceOccurrenceCard from "components/occurrences/ResourceOccurrenceCard";
import dayjs from "dayjs";
import { createMockOccurrence } from "test/testing-utils/mocks";

jest.mock("dayjs");

describe("ResourceOccurrenceCard", () => {
  let occurrence, rerender;

  beforeEach(() => {
    occurrence = createMockOccurrence();

    dayjs.mockReturnValue({
      format: jest.fn().mockReturnValue(occurrence.createTime),
    });
    const utils = render(<ResourceOccurrenceCard occurrence={occurrence} />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should render the shared occurrence details", () => {
    expect(screen.getByText(occurrence.kind)).toBeInTheDocument();
    expect(
      screen.getByText(occurrence.createTime, { exact: false })
    ).toBeInTheDocument();
  });

  it("should render the vulnerability details if the occurrence type is vulnerability", () => {
    occurrence = createMockOccurrence("VULNERABILITY");
    rerender(<ResourceOccurrenceCard occurrence={occurrence} />);

    expect(screen.getByText(/effective severity:/i)).toBeInTheDocument();
  });

  it("should render the discovery details if the occurrence type is discovery", () => {
    occurrence = createMockOccurrence("DISCOVERY");
    rerender(<ResourceOccurrenceCard occurrence={occurrence} />);

    expect(screen.getByText(/analysis status:/i)).toBeInTheDocument();
  });
});
