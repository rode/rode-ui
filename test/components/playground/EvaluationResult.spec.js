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

describe("EvaluationResult", () => {
  it("should return null when there are no results", () => {
    render(<EvaluationResult results={null} />);

    expect(screen.queryByText(/the resource/i)).not.toBeInTheDocument();
  });

  it("should render the success message if the resource passed evaluation", () => {
    const successResult = {
      pass: true,
    };
    render(<EvaluationResult results={successResult} />);

    expect(
      screen.getByText(/the resource passed the policy/i)
    ).toBeInTheDocument();
    expect(screen.getByTitle(/badge check/i)).toBeInTheDocument();
  });

  it("should render the failure message and the explanation if the resource failed evaluation", () => {
    const failedResult = {
      pass: false,
      explanation: chance.string(),
    };
    render(<EvaluationResult results={failedResult} />);

    expect(
      screen.getByText(/the resource failed the policy/i)
    ).toBeInTheDocument();
    expect(screen.getByTitle(/exclamation/i)).toBeInTheDocument();
    expect(screen.getByText(failedResult.explanation)).toBeInTheDocument();
  });
});
