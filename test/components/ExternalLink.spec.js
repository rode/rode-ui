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
import ExternalLink from "components/ExternalLink";

describe("ExternalLink", () => {
  let label, href;

  beforeEach(() => {
    label = chance.string();
  });

  it("should return null when no href is present", () => {
    render(<ExternalLink href={null} label={label} />);

    expect(screen.queryByText(label)).not.toBeInTheDocument();
  });

  describe("link exists and should show", () => {
    beforeEach(() => {
      href = chance.url();
      render(<ExternalLink href={href} label={label} />);
    });

    it("should render the link if an href exists", () => {
      const renderedLink = screen.getByText(label);
      expect(renderedLink).toBeInTheDocument();
      expect(renderedLink).toHaveAttribute("href", href);
      expect(renderedLink).toHaveAttribute("target", "_blank");
      expect(renderedLink).toHaveAttribute("rel", "noreferrer");
    });

    it("should render the external link icon", () => {
      expect(screen.getByTitle(/external link/i)).toBeInTheDocument();
    });
  });
});
