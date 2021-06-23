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
import { render, screen } from "test/testing-utils/renderer";
import PolicyBreadcrumbs from "components/policies/PolicyBreadcrumbs";

describe("PolicyBreadcrumbs", () => {
  let policySearchTerm, state, rerender;

  beforeEach(() => {
    policySearchTerm = chance.string();
    state = {
      policySearchTerm,
    };
    const utils = render(<PolicyBreadcrumbs />, { state });
    rerender = utils.rerender;
  });

  describe("searchTerm exists", () => {
    it("should display the Policy Search text", () => {
      expect(screen.getByText(/policy search/i)).toBeInTheDocument();
    });

    it("should return a breadcrumb for the search term", () => {
      const renderedSearchTermLink = screen.getByText(policySearchTerm, {
        exact: false,
      });
      expect(renderedSearchTermLink).toBeInTheDocument();
      expect(renderedSearchTermLink).toHaveAttribute(
        "href",
        `/policies?search=${encodeURIComponent(policySearchTerm)}`
      );
    });
  });

  describe("searching for all policies", () => {
    it("should return the correct breadcrumb when viewing all policies", () => {
      state.policySearchTerm = "all";

      rerender(<PolicyBreadcrumbs />);
      const renderedLink = screen.getByText(/view all policies/i);
      expect(renderedLink).toBeInTheDocument();
      expect(renderedLink).toHaveAttribute("href", `/policies?search=all`);
    });
  });

  describe("no searchTerm exists", () => {
    it("should return null", () => {
      state.policySearchTerm = "";

      rerender(<PolicyBreadcrumbs />);

      expect(screen.queryByText(policySearchTerm)).toBeNull();
      expect(screen.queryByText("Policy Search")).toBeNull();
    });
  });
});
