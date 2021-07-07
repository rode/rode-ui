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
import ResourceEvaluation from "components/resources/ResourceEvaluation";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import dayjs from "dayjs";
import userEvent from "@testing-library/user-event";

jest.mock("hooks/usePaginatedFetch");
jest.mock("dayjs");

describe("ResourceEvaluation", () => {
  let evaluation, usePaginatedFetchResponse, rerender;
  beforeEach(() => {
    evaluation = {
      id: chance.guid(),
      pass: chance.bool(),
      policyGroup: chance.string(),
      created: chance.timestamp(),
      policyEvaluations: [
        {
          id: chance.guid(),
          pass: chance.bool(),
          policyName: chance.string(),
          policyVersion: chance.d4(),
          violations: [],
        },
      ],
    };
    usePaginatedFetchResponse = {
      data: evaluation,
      loading: false,
      isLastPage: false,
      goToNextPage: jest.fn(),
    };
    dayjs.mockReturnValue({
      format: jest.fn().mockReturnValue(evaluation.created),
    });

    usePaginatedFetch.mockReturnValue(usePaginatedFetchResponse);
    const utils = render(<ResourceEvaluation evaluation={evaluation} />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render details about the evaluation", () => {
    const renderedPolicyGroup = screen.getByText(evaluation.policyGroup);
    expect(renderedPolicyGroup).toBeInTheDocument();
    expect(renderedPolicyGroup).toHaveAttribute(
      "href",
      `/policy-groups/${encodeURIComponent(evaluation.policyGroup)}`
    );
    expect(screen.getByText(evaluation.created)).toBeInTheDocument();
  });

  it("should show policy evaluations when the details are expanded", () => {
    userEvent.click(
      screen.getByRole("button", { "aria-label": "Toggle Card Details" })
    );
    evaluation.policyEvaluations.forEach((policyEval) => {
      expect(screen.getByText(policyEval.policyName)).toBeInTheDocument();
    });
  });

  describe("passing evaluation", () => {
    beforeEach(() => {
      evaluation.pass = true;
      rerender(<ResourceEvaluation evaluation={evaluation} />);
    });

    it("should render the successful outcome", () => {
      expect(screen.getByTitle(/badge check$/i)).toBeInTheDocument();
      expect(screen.getByText(/^pass$/i)).toBeInTheDocument();
    });
  });

  describe("failing evaluation", () => {
    beforeEach(() => {
      evaluation.pass = false;
      rerender(<ResourceEvaluation evaluation={evaluation} />);
    });

    it("should render the successful outcome", () => {
      expect(screen.getByTitle(/exclamation$/i)).toBeInTheDocument();
      expect(screen.getByText(/^fail$/i)).toBeInTheDocument();
    });
  });
});
