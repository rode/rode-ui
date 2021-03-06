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
import DetailsNavigation from "components/shared/DetailsNavigation";

describe("DetailsNavigation", () => {
  let links, activeSection;

  beforeEach(() => {
    links = chance.n(
      () => ({
        label: chance.string(),
        href: `/${chance.word()}#${chance.word()}`,
      }),
      chance.d4() + 2
    );
    activeSection = links[0].href.split("#")[1];

    render(<DetailsNavigation links={links} activeSection={activeSection} />);
  });

  it("should render a section for each link passed", () => {
    links.forEach(({ label, href }) => {
      const renderedSection = screen.getByText(label);
      expect(renderedSection).toBeInTheDocument();
      expect(renderedSection).toHaveAttribute("href", href);
    });
  });

  it("should apply different styling to the active section", () => {
    const renderedActiveSection = screen.getByText(links[0].label);
    expect(renderedActiveSection).toHaveClass("activeLink");

    const renderedInactiveSection = screen.getByText(
      links[links.length - 1].label
    );
    expect(renderedInactiveSection).toHaveClass("link");
  });
});
