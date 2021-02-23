import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResourceSearchResult from "components/resources/ResourceSearchResult";
import {useRouter} from "next/router";

jest.mock("next/router");

describe("ResourceSearchResult", () => {
  let searchResult, resourceName, version, pushMock;

  beforeEach(() => {
    resourceName = chance.word();
    version = chance.string();
    searchResult = {
      uri: `${resourceName}@${version}`,
    };
    pushMock = jest.fn();
    useRouter.mockReturnValue({
      push: pushMock
    });
    render(<ResourceSearchResult searchResult={searchResult} />);
  });

  it("should render the resource details", () => {
    expect(screen.getByText(`Resource Name: ${resourceName}`)).toBeInTheDocument();
    expect(screen.getByText(`Version: ${version}`)).toBeInTheDocument();
  });

  it("should render a view details button ", () => {
    const renderedButton = screen.getByText('View Details');

    expect(renderedButton).toBeInTheDocument();

    userEvent.click(renderedButton);
    expect(pushMock).toHaveBeenCalledWith(`/resources/${searchResult.uri}`);
  });
});
