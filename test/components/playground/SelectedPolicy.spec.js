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
import SelectedPolicy from "components/playground/SelectedPolicy";

describe("SelectedPolicy", () => {
  let policy, clearPolicy;

  beforeEach(() => {
    policy = {
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.string(),
    };

    clearPolicy = jest.fn();

    render(<SelectedPolicy policy={policy} clearPolicy={clearPolicy} />);
  });

  it("should render the policy name", () => {
    expect(screen.getByText(policy.name)).toBeInTheDocument();
  });

  it("should render the button to clear the policy", () => {
    const renderedButton = screen.getByRole("button", { name: "Clear Policy" });

    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);
    expect(clearPolicy).toHaveBeenCalledTimes(1);
  });

  it("should render a button to toggle the policy details", () => {
    const renderedButton = screen.getByRole("button", {
      name: "Show Policy Details",
    });

    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);

    expect(screen.getByText(policy.description)).toBeInTheDocument();
    expect(
      screen.getByText(policy.regoContent, { exact: false })
    ).toBeInTheDocument();
  });
});
