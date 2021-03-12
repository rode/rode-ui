import React from "react";
import { render, screen } from "@testing-library/react";
import SearchResult from "components/shared/search/SearchResult";

describe("SearchBar", () => {
  let mainText, subText, actionButtonText;

  beforeEach(() => {
    mainText = chance.sentence();
    subText = chance.sentence();
    actionButtonText = chance.string();
    render(
      <SearchResult
        mainText={mainText}
        subText={subText}
        actionButton={<button type={"button"}>{actionButtonText}</button>}
      />
    );
  });

  it("should render the main text", () => {
    const renderedText = screen.getByText(mainText);
    expect(renderedText).toBeInTheDocument();
  });

  it("should render the sub text", () => {
    const renderedText = screen.getByText(subText);
    expect(renderedText).toBeInTheDocument();
  });

  it("should render the action button", () => {
    const renderedButton = screen.getByText(actionButtonText);
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton.type).toBe("button");
  });
});
