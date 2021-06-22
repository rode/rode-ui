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
import PolicyDetails from "components/policies/PolicyDetails";

describe("PolicyDetails", () => {
  let policy;

  beforeEach(() => {
    policy = {
      regoContent: chance.word(),
    };

    render(<PolicyDetails policy={policy} />);
  });

  it("should display the policy code", () => {
    expect(screen.getByText("Rego Policy Code")).toBeInTheDocument();
    expect(
      screen.getByText(policy.regoContent, { exact: false })
    ).toBeInTheDocument();
  });
});
