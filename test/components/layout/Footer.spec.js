/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "components/layout/Footer";

describe("Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it("should render the rode title and subtitle", () => {
    expect(screen.getByText(/rode/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Services and tools for enabling Enterprise Automated Governance, Policy as Code/i
      )
    ).toBeInTheDocument();
  });

  it("should render a link to github", () => {
    const renderedLink = screen.getByTitle(/github/i);
    expect(renderedLink).toBeInTheDocument();
    expect(renderedLink.closest("a")).toHaveAttribute(
      "href",
      "https://github.com/rode"
    );
  });

  it("should render a link to the liatrio website", () => {
    const renderedLink = screen.getByTitle(/liatrio/i);
    expect(renderedLink).toBeInTheDocument();
    expect(renderedLink.closest("a")).toHaveAttribute(
      "href",
      "https://www.liatrio.com/"
    );
  });

  it("should render a link to twitter", () => {
    const renderedLink = screen.getByTitle(/twitter/i);
    expect(renderedLink).toBeInTheDocument();
    expect(renderedLink.closest("a")).toHaveAttribute(
      "href",
      "https://twitter.com/liatrio"
    );
  });
});
