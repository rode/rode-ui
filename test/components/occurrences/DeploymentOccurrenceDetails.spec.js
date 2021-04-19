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
import DeploymentOccurrenceDetails from "components/occurrences/DeploymentOccurrenceDetails";
import { createMockMappedDeploymentOccurrence } from "test/testing-utils/mocks";
import dayjs from "dayjs";

jest.mock("dayjs");

describe("DeploymentOccurrenceDetails", () => {
  let occurrence;

  beforeEach(() => {
    occurrence = createMockMappedDeploymentOccurrence();
    dayjs.mockReturnValue({
      format: jest
        .fn()
        .mockReturnValueOnce(occurrence.deploymentStart)
        .mockReturnValue(occurrence.deploymentEnd),
    });

    render(<DeploymentOccurrenceDetails occurrence={occurrence} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should display the summary details of the deployment", () => {
    expect(screen.getByText("Deployment")).toBeInTheDocument();
    expect(screen.getByText(/deployed to/i)).toBeInTheDocument();
    expect(
      screen.getByText(`Started ${occurrence.deploymentStart}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Deployment End ${occurrence.deploymentEnd}`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show JSON" })
    ).toBeInTheDocument();
  });

  it("should show the list of all resources that were deployed", () => {
    const renderedDeployedResources = screen.getByText(/resources deployed:/i);
    expect(renderedDeployedResources).toBeInTheDocument();
    expect(renderedDeployedResources).toHaveTextContent(
      `Resources Deployed: ${occurrence.resourceUris.join(", ")}`
    );
  });
});
