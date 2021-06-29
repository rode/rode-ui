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

import PolicyAssignmentCard from "components/policy-groups/PolicyAssignmentCard";

describe("Policy Assignment Card", () => {
  let policy, actions;

  beforeEach(() => {
    policy = {
      policyName: chance.string(),
      policyVersion: chance.string(),
    };

    actions = <button className={"test"}>Button here</button>;
    render(<PolicyAssignmentCard policy={policy} actions={actions} />);
  });

  it("should render the policy details", () => {
    expect(screen.getByText(policy.policyName)).toBeInTheDocument();
    expect(screen.getByText("Version")).toBeInTheDocument();
    expect(screen.getByText(policy.policyVersion)).toBeInTheDocument();
  });

  it("should render the actions", () => {
    const renderedButtonText = screen.getByText("Button here");
    expect(renderedButtonText).toHaveClass("test");
  });
});
