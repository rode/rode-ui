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
import SelectedResource from "components/playground/SelectedResource";
import { useFetch } from "hooks/useFetch";
import { createMockResourceUri } from "test/testing-utils/mocks";
import userEvent from "@testing-library/user-event";
import { copy } from "utils/shared-utils";

jest.mock("hooks/useFetch");
jest.mock("utils/shared-utils");

describe("SelectedResource", () => {
  let resourceUri,
    name,
    version,
    fetchResponse,
    setEvaluationResource,
    clearEvaluation,
    rerender;

  beforeEach(() => {
    setEvaluationResource = jest.fn();
    clearEvaluation = jest.fn();
    fetchResponse = {
      data: {
        originals: chance.string(),
      },
      loading: false,
    };

    useFetch.mockReturnValue(fetchResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("resource has not been selected", () => {
    beforeEach(() => {
      resourceUri = null;
      render(
        <SelectedResource
          setEvaluationResource={setEvaluationResource}
          clearEvaluation={clearEvaluation}
          resourceUri={resourceUri}
        />
      );
    });

    it("should render the instructions to search for a resource", () => {
      expect(
        screen.getByText(/search for a resource to begin/i)
      ).toBeInTheDocument();
    });

    it("should render the button to search for a resource", () => {
      expect(
        screen.getByLabelText(/^search for resources/i)
      ).toBeInTheDocument();
    });
  });

  describe("resource has been selected", () => {
    beforeEach(() => {
      name = chance.string();
      version = chance.string();
      resourceUri = createMockResourceUri(name, version);
      const utils = render(
        <SelectedResource
          setEvaluationResource={setEvaluationResource}
          clearEvaluation={clearEvaluation}
          resourceUri={resourceUri}
        />
      );
      rerender = utils.rerender;
    });

    it("should call to fetch the occurrence data when a resource is selected", () => {
      expect(useFetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("/api/occurrences", {
          resourceUri: resourceUri,
        });
    });

    it("should render the resource name", () => {
      expect(
        screen.getByText("Resource", { selector: "span" })
      ).toBeInTheDocument();
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    it("should render the resource version", () => {
      expect(
        screen.getByText("Version", { selector: "span" })
      ).toBeInTheDocument();
      expect(screen.getByText(version.substring(0, 12))).toBeInTheDocument();
    });

    it("should render the occurrence data label", () => {
      expect(screen.getByText("Occurrence Data")).toBeInTheDocument();
    });

    it("should render the loading indicator while fetching the occurrence data", () => {
      fetchResponse.loading = true;
      rerender(
        <SelectedResource
          setEvaluationResource={setEvaluationResource}
          clearEvaluation={clearEvaluation}
          resourceUri={resourceUri}
        />
      );
      expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    });

    it("should render the occurrence data once fetched", () => {
      expect(
        screen.getByText(
          JSON.stringify(fetchResponse.data.originals, null, 2),
          {
            exact: false,
          }
        )
      ).toBeInTheDocument();
    });

    it("should render the button to clear the selected resource", () => {
      const renderedButton = screen.getByLabelText("Clear Resource");
      expect(renderedButton).toBeInTheDocument();

      userEvent.click(renderedButton);
      expect(setEvaluationResource)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(null);
      expect(clearEvaluation).toHaveBeenCalled();
    });

    it("should render the button to copy the occurrence data", () => {
      const renderedButton = screen.getByLabelText("Copy Occurrence Data");
      expect(renderedButton).toBeInTheDocument();

      userEvent.click(renderedButton);
      expect(copy)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(
          JSON.stringify(fetchResponse.data.originals, null, 2)
        );
    });
  });
});
