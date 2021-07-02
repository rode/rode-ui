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
import EvaluationHistory from "components/resources/EvaluationHistory";
import userEvent from "@testing-library/user-event";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";

jest.mock("hooks/usePaginatedFetch");

describe("EvaluationHistory", () => {
  let resourceUri, evaluations, usePaginatedFetchResponse, rerender;
  beforeEach(() => {
    resourceUri = createMockResourceUri();
    evaluations = chance.n(
      () => ({
        id: chance.guid(),
        pass: chance.bool(),
        policyGroup: chance.string(),
        created: chance.timestamp(),
        policyEvaluations: [],
      }),
      chance.d4()
    );
    usePaginatedFetchResponse = {
      data: evaluations,
      loading: false,
      isLastPage: false,
      goToNextPage: jest.fn(),
    };

    usePaginatedFetch.mockReturnValue(usePaginatedFetchResponse);
    const utils = render(<EvaluationHistory resourceUri={resourceUri} />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("no resource uri is specified", () => {
    it("should not call to fetch the evaluation history data", () => {
      rerender(<EvaluationHistory resourceUri={null} />);
      expect(usePaginatedFetch).toHaveBeenCalledWith(null, {}, 10);
    });
  });

  it("should call to fetch the resource evaluations when the resourceUri is specified", () => {
    expect(usePaginatedFetch).toHaveBeenCalledWith(
      `/api/resources/${encodeURIComponent(resourceUri)}/resource-evaluations`,
      {},
      10
    );
  });

  it("should show a loading indicator while fetching the evaluations", () => {
    usePaginatedFetchResponse.loading = true;
    rerender(<EvaluationHistory resourceUri={resourceUri} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should display a resource evaluation for each found evaluation", () => {
    evaluations.forEach((evaluation) => {
      expect(screen.getByText(evaluation.policyGroup)).toBeInTheDocument();
    });
  });

  it("should display a button to view more evaluations if there are additional evals to fetch", () => {
    const renderedViewMoreButton = screen.getByLabelText(
      "See More Evaluations"
    );
    expect(renderedViewMoreButton).toBeInTheDocument();
    userEvent.click(renderedViewMoreButton);

    expect(usePaginatedFetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
  });

  it("should display a message when no evaluations have been done against the resource", () => {
    usePaginatedFetchResponse.data = [];
    rerender(<EvaluationHistory resourceUri={resourceUri} />);
    expect(
      screen.getByText("This resource at this version has not been evaluated.")
    );
  });
});
