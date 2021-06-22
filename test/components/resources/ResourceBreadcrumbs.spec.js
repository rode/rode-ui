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
import ResourceBreadcrumbs from "components/resources/ResourceBreadcrumbs";
import { useResources } from "providers/resources";

jest.mock("providers/resources");

describe("ResourceBreadcrumbs", () => {
  let searchTerm;

  beforeEach(() => {
    searchTerm = chance.string();
  });

  describe("searchTerm exists", () => {
    beforeEach(() => {
      useResources.mockReturnValue({
        state: {
          resourceSearchTerm: searchTerm,
        },
      });

      render(<ResourceBreadcrumbs />);
    });

    it("should display the Resource Search indicator", () => {
      expect(screen.getByText(/resource search/i)).toBeInTheDocument();
    });

    it("should return a breadcrumb for the search term", () => {
      const renderedSearchTermLink = screen.getByText(searchTerm, {
        exact: false,
      });
      expect(renderedSearchTermLink).toBeInTheDocument();
      expect(renderedSearchTermLink).toHaveAttribute(
        "href",
        `/resources?search=${encodeURIComponent(searchTerm)}`
      );
    });

    it("should return the correct breadcrumb when viewing all resources", () => {
      useResources.mockReturnValue({
        state: {
          resourceSearchTerm: "all",
        },
      });

      render(<ResourceBreadcrumbs />);
      const renderedLink = screen.getByText(/view all resources/i);
      expect(renderedLink).toBeInTheDocument();
      expect(renderedLink).toHaveAttribute("href", `/resources?search=all`);
    });
  });

  describe("no searchTerm exists", () => {
    it("should return null", () => {
      useResources.mockReturnValue({
        state: {},
      });

      render(<ResourceBreadcrumbs />);
      expect(screen.queryByText(searchTerm)).toBeNull();
    });
  });
});
