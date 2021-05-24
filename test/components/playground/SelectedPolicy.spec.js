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
import SelectedPolicy from "components/playground/SelectedPolicy";

describe("SelectedPolicy", () => {
  let policy, rerender;

  beforeEach(() => {
    policy = {
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.string(),
    };

    const utils = render(<SelectedPolicy policy={policy} />);
    rerender = utils.rerender;
  });

  it("should render the rego policy label", () => {
    expect(screen.getByText(/rego policy code/i)).toBeInTheDocument();
  });

  it("should render the rego policy code", () => {
    expect(
      screen.getByText(policy.regoContent, { exact: false })
    ).toBeInTheDocument();
  });

  it("should render the instructions if no policy is selected", () => {
    rerender(<SelectedPolicy policy={null} />);

    expect(screen.getByText(/select a policy to begin/i)).toBeInTheDocument();
  });
});
