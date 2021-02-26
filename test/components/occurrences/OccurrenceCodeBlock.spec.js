import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMockOccurrence } from "../../testing-utils/mocks";
import OccurrenceCodeBlock from "../../../components/occurrences/OccurrenceCodeBlock";

describe("OccurrenceCodeBlock", () => {
  let occurrence;

  beforeEach(() => {
    occurrence = createMockOccurrence();

    render(<OccurrenceCodeBlock occurrence={occurrence} />);
  });

  it("should render the button to toggle the code block", () => {
    expect(screen.getByText(/show json/i)).toBeInTheDocument();
  });

  it("should show the code block when appropriate", () => {
    userEvent.click(screen.getByText(/show json/i));
    expect(screen.getByTestId("occurrenceJson")).toBeInTheDocument();

    userEvent.click(screen.getByText(/hide json/i));
    expect(screen.queryByTestId("occurrenceJson")).not.toBeInTheDocument();
  });
});
