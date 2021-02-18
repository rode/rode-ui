import React from "react";
import { render, screen } from "@testing-library/react";
import Icon from "../../components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

describe("Icon", () => {
  it("should render the search icon when specified", () => {
    render(<Icon name={ICON_NAMES.SEARCH} />);

    expect(screen.getByTitle(/search/i)).toBeInTheDocument();
  });
});
