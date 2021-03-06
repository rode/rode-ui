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
  let label, href, rerender;

  beforeEach(() => {
    label = chance.string();
    const utils = render(<ExternalLink href={null} label={label} />);
    rerender = utils.rerender;
  });

  it("should return null when no href is present and no fallback component is specified", () => {
    expect(screen.queryByText(label)).not.toBeInTheDocument();
  });

  it("should return the fallback component when no href is present", () => {
    const fallbackText = chance.string();
    rerender(
      <ExternalLink
        href={null}
        label={label}
        fallback={<p>{fallbackText}</p>}
      />
    );

    expect(screen.getByText(fallbackText)).toBeInTheDocument();
  });

  describe("link exists and should show", () => {
    beforeEach(() => {
      href = chance.url();
      rerender(<ExternalLink href={href} label={label} />);
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

    it("should allow the user to pass additional classes", () => {
      const className = chance.string();
      rerender(
        <ExternalLink href={href} label={label} className={className} />
      );

      expect(screen.getByText(label)).toHaveClass(className);
    });
  });
});
