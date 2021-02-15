import { render, screen } from "@testing-library/react";
import Home from "../../pages/index";

describe("index", () => {
  it("should pass", () => {
    render(<Home />);
    const expected =
      "Instantly deploy your Next.js site to a public URL with Vercel.";
    expect(screen.getByText(expected)).toBeDefined();
  });
});
