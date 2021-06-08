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
import SelectedPolicy from "components/playground/SelectedPolicy";
import { copy } from "utils/shared-utils";
import userEvent from "@testing-library/user-event";

jest.mock("utils/shared-utils");

describe("SelectedPolicy", () => {
  let policy, setPolicy, clearEvaluation;

  beforeEach(() => {
    setPolicy = jest.fn();
    clearEvaluation = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("policy has not been selected", () => {
    beforeEach(() => {
      policy = null;
      render(
        <SelectedPolicy
          policy={policy}
          setPolicy={setPolicy}
          clearEvaluation={clearEvaluation}
        />
      );
    });

    it("should render the instructions to search for a policy", () => {
      expect(
        screen.getByText(/search for a policy to begin/i)
      ).toBeInTheDocument();
    });

    it("should render the search button", () => {
      expect(
        screen.getByLabelText(/^search for policies/i)
      ).toBeInTheDocument();
    });
  });

  describe("policy has been selected", () => {
    beforeEach(() => {
      policy = {
        name: chance.string(),
        description: chance.string(),
        regoContent: chance.word({ syllables: chance.d10() }),
      };
      render(
        <SelectedPolicy
          policy={policy}
          setPolicy={setPolicy}
          clearEvaluation={clearEvaluation}
        />
      );
    });

    it("should render the rego policy label", () => {
      expect(
        screen.getByText("Rego Policy Code", { selector: "p" })
      ).toBeInTheDocument();
    });

    it("should render the rego policy code", () => {
      expect(screen.getByTestId("regoPolicyCode")).toBeInTheDocument();
      expect(
        screen.getByText(policy.regoContent, { exact: false })
      ).toBeInTheDocument();
    });

    it("should render the policy name", () => {
      expect(screen.getByText("Policy")).toBeInTheDocument();
      expect(screen.getByText(policy.name)).toBeInTheDocument();
    });

    it("should render the button to clear the selected policy", () => {
      const renderedButton = screen.getByLabelText(/Clear Policy/);
      expect(renderedButton).toBeInTheDocument();

      userEvent.click(renderedButton);
      expect(setPolicy).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(null);
      expect(clearEvaluation).toHaveBeenCalled();
    });

    it("should render the button to copy the rego content", () => {
      const renderedButton = screen.getByLabelText(/Copy Rego Policy Code/);
      expect(renderedButton).toBeInTheDocument();

      userEvent.click(renderedButton);
      expect(copy)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(policy.regoContent);
    });
  });
});
