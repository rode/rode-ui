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
import userEvent from "@testing-library/user-event";
import PlaygroundSearchResult from "components/playground/PlaygroundSearchResult";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("utils/resource-utils");

describe("PlaygroundSearchResult", () => {
  let searchResult, type, onClick, selected, resourceDetails, rerender;

  beforeEach(() => {
    onClick = jest.fn();
    selected = true;
    type = chance.pickone(["resource", "policy"]);
    searchResult = {
      name: chance.string(),
      description: chance.string(),
      resourceUri: createMockResourceUri(),
    };
    resourceDetails = {
      resourceName: chance.string(),
      resourceVersion: chance.string(),
    };

    getResourceDetails.mockReturnValue(resourceDetails);

    const utils = render(
      <PlaygroundSearchResult
        searchResult={searchResult}
        onClick={onClick}
        selected={selected}
        type={type}
      />
    );

    rerender = utils.rerender;
  });

  it("should render the correct button text when the search result has been selected for evaluation", () => {
    const renderedButton = screen.getByRole("button", { name: "Selected" });
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toBeDisabled();
    expect(screen.getByTitle(/check/i)).toBeInTheDocument();
  });

  describe("Resource search result", () => {
    beforeEach(() => {
      searchResult = {
        resourceUri: chance.string(),
      };
      type = "resource";
      selected = false;
      rerender(
        <PlaygroundSearchResult
          searchResult={searchResult}
          onClick={onClick}
          selected={selected}
          type={type}
        />
      );
    });

    it("should show the resource name and version", () => {
      expect(
        screen.getByText(resourceDetails.resourceName)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Version: ${resourceDetails.resourceVersion}`)
      ).toBeInTheDocument();
    });

    it("should render the button to select the resource", () => {
      const renderedButton = screen.getByRole("button", {
        name: "Select Resource",
      });
      expect(renderedButton).toBeInTheDocument();

      userEvent.click(renderedButton);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Policy search result", () => {
    beforeEach(() => {
      searchResult = {
        name: chance.string(),
        description: chance.string(),
      };
      type = "policy";
      selected = false;
      rerender(
        <PlaygroundSearchResult
          searchResult={searchResult}
          onClick={onClick}
          selected={selected}
          type={type}
        />
      );
    });

    it("should show the policy name and description", () => {
      expect(screen.getByText(searchResult.name)).toBeInTheDocument();
      expect(screen.getByText(searchResult.description)).toBeInTheDocument();
    });

    it("should render the button to select the policy", () => {
      const renderedButton = screen.getByRole("button", {
        name: "Select Policy",
      });
      expect(renderedButton).toBeInTheDocument();

      userEvent.click(renderedButton);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
