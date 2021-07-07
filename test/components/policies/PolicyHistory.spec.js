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
import PolicyHistory from "components/policies/PolicyHistory";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "utils/constants";
import userEvent from "@testing-library/user-event";

jest.mock("hooks/usePaginatedFetch");
jest.mock("dayjs");

describe("PolicyHistory", () => {
  let policy, policyVersions, goToNextPage, mockResponse, format, rerender;

  beforeEach(() => {
    policy = {
      id: chance.string(),
    };
    policyVersions = chance
      .n(
        () => ({
          message: chance.string(),
          created: chance.timestamp(),
          regoContent: chance.string(),
        }),
        chance.d4()
      )
      .map((version, index) => ({
        ...version,
        version: index + 1,
      }));
    goToNextPage = jest.fn();
    format = jest.fn();
    dayjs.mockReturnValue({
      format,
    });

    mockResponse = {
      data: policyVersions,
      loading: false,
      isLastPage: false,
      goToNextPage,
    };

    usePaginatedFetch.mockReturnValue(mockResponse);
    const utils = render(<PolicyHistory policy={policy} />);
    rerender = utils.rerender;
  });

  it("should call to fetch the policy versions", () => {
    expect(usePaginatedFetch).toHaveBeenCalledWith(
      `/api/policies/${policy.id}/versions`,
      {},
      15
    );
  });

  it("should show a loading indicator while fetching the data", () => {
    mockResponse.loading = true;
    rerender(<PolicyHistory policy={policy} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should show a card for each policy version", () => {
    policyVersions.forEach((version) => {
      expect(screen.getByText(version.message)).toBeInTheDocument();
    });
  });

  it("should show the rego content of the version when the user selects a version to view", () => {
    policyVersions.forEach((version) => {
      userEvent.click(
        screen.getByText(`v${version.version}`, { exact: false })
      );
      expect(
        screen.getByText(version.regoContent, { exact: false })
      ).toBeInTheDocument();
    });
  });

  it("should indicate the latest version to the user", () => {
    policyVersions.forEach((version, index) => {
      expect(
        screen.getByText(`v${version.version}${index === 0 ? " (latest)" : ""}`)
      ).toBeInTheDocument();
      expect(dayjs).toHaveBeenCalledWith(version.created);
      expect(format).toHaveBeenCalledWith(DATE_TIME_FORMAT);
    });
  });

  it("should show a button to view more history if not viewing the last page of results", () => {
    mockResponse.isLastPage = false;
    rerender(<PolicyHistory policy={policy} />);

    const renderedButton = screen.getByText("View More");
    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);
    expect(goToNextPage).toHaveBeenCalledTimes(1);
  });
});
