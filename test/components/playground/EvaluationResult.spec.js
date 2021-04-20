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
import EvaluationResult from "components/playground/EvaluationResult";
import userEvent from "@testing-library/user-event";
import { copy } from "utils/shared-utils";
import { createMockEvaluationResult } from "test/testing-utils/mocks";

jest.mock("utils/shared-utils");

describe("EvaluationResult", () => {
  beforeEach(() => {
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: jest.fn(),
    });
  });
  it("should return null when there are no results", () => {
    render(<EvaluationResult results={null} />);

    expect(screen.queryByText(/the resource/i)).not.toBeInTheDocument();
  });

  it("should render the success message if the resource passed evaluation", () => {
    const successResult = createMockEvaluationResult(true);

    render(<EvaluationResult results={successResult} />);

    expect(
      screen.getByText(/the resource passed the policy/i)
    ).toBeInTheDocument();
    expect(screen.getByTitle(/badge check/i)).toBeInTheDocument();
  });

  it("should render the failure message and the explanation if the resource failed evaluation", () => {
    const failedResult = createMockEvaluationResult(false);

    render(<EvaluationResult results={failedResult} />);

    expect(
      screen.getByText(/the resource failed the policy/i)
    ).toBeInTheDocument();
    expect(screen.getByTitle(/exclamation/i)).toBeInTheDocument();
  });

  it("should render the evaluation table regardless of outcome", () => {
    const result = {
      pass: chance.bool(),
      result: [
        {
          violations: [
            {
              pass: true,
              message: chance.string(),
            },
            {
              pass: false,
              message: null,
            },
          ],
        },
      ],
      explanation: chance.string(),
    };
    render(<EvaluationResult results={result} />);

    expect(
      screen.getByText(/the resource (?:passed|failed) the policy/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/^pass$/i)).toBeInTheDocument();
    expect(
      screen.getByText(result.result[0].violations[0].message)
    ).toBeInTheDocument();

    expect(screen.getByText(/^fail$/i)).toBeInTheDocument();
    expect(
      screen.getByText("Rule message not specified in policy")
    ).toBeInTheDocument();
  });

  it("should render the button to show the full explanation of the evaluation", () => {
    const result = createMockEvaluationResult();
    render(<EvaluationResult results={result} />);

    const renderedButton = screen.getByRole("button", {
      name: "Show Full Evaluation",
    });
    expect(renderedButton).toBeInTheDocument();

    userEvent.click(renderedButton);

    expect(screen.getByText("Evaluation Explanation")).toBeInTheDocument();
    expect(
      screen.getByText(JSON.stringify(result.explanation, null, 2))
    ).toBeInTheDocument();

    const renderedCopyButton = screen.getByRole("button", {
      name: "Copy to Clipboard",
    });
    userEvent.click(renderedCopyButton);
    expect(copy)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(JSON.stringify(result.explanation, null, 2));
    userEvent.click(screen.getByLabelText("Close Modal"));

    expect(
      screen.queryByText("Evaluation Explanation")
    ).not.toBeInTheDocument();
  });
});
