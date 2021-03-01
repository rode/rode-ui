import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "components/Loading";

describe("Loading", () => {
  it("should return null if not loading", () => {
    render(<Loading loading={false} />);

    expect(screen.queryByTestId("loadingIndicator")).toBeNull();
  });

  it("should return the loading spinner when loading", () => {
    render(<Loading loading={true} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });
});
