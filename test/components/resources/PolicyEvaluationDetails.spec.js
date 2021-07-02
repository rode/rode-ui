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
import PolicyEvaluationDetails from "components/resources/PolicyEvaluationDetails";
import userEvent from "@testing-library/user-event";

describe("PolicyEvaluationDetails", () => {
  let policyEvaluation, rerender;
  beforeEach(() => {
    policyEvaluation = {
      id: chance.guid(),
      pass: chance.bool(),
      policyName: chance.string(),
      policyVersion: chance.d4(),
      created: chance.timestamp(),
      violations: [
        {
          id: chance.guid(),
          pass: true,
          message: chance.sentence(),
        },
        {
          id: chance.guid(),
          pass: false,
          message: chance.sentence(),
        },
      ],
    };
    const utils = render(
      <PolicyEvaluationDetails policyEvaluation={policyEvaluation} />
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render details about the evaluation", () => {
    expect(screen.getByText(policyEvaluation.policyName)).toBeInTheDocument();
    expect(
      screen.getByText(`v${policyEvaluation.policyVersion}`)
    ).toBeInTheDocument();
  });

  it("should show policy violations when the details are expanded", () => {
    userEvent.click(
      screen.getByRole("button", { "aria-label": "Toggle Card Details" })
    );
    policyEvaluation.violations.forEach((violation) => {
      if (violation.pass) {
        expect(screen.getByText(/pass/i)).toBeInTheDocument();
      } else {
        expect(screen.getByText(/fail/i)).toBeInTheDocument();
      }
      expect(screen.getByText(violation.message)).toBeInTheDocument();
    });
  });

  describe("passing evaluation", () => {
    beforeEach(() => {
      policyEvaluation.pass = true;
      rerender(<PolicyEvaluationDetails policyEvaluation={policyEvaluation} />);
    });

    it("should render the successful outcome", () => {
      expect(screen.getByTitle(/badge check outline$/i)).toBeInTheDocument();
    });
  });

  describe("failing evaluation", () => {
    beforeEach(() => {
      policyEvaluation.pass = false;
      rerender(<PolicyEvaluationDetails policyEvaluation={policyEvaluation} />);
    });

    it("should render the successful outcome", () => {
      expect(screen.getByTitle(/exclamation outline$/i)).toBeInTheDocument();
    });
  });
});
