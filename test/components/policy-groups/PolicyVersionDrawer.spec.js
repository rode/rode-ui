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
import PolicyVersionDrawer from "components/policy-groups/PolicyVersionDrawer";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "utils/constants";
import userEvent from "@testing-library/user-event";

jest.mock("hooks/usePaginatedFetch");
jest.mock("dayjs");

describe("PolicyVersionDrawer", () => {
  let isOpen,
    onClose,
    assignedPolicy,
    onVersionSelect,
    versions,
    paginatedFetchResponse,
    format,
    rerender;

  beforeEach(() => {
    isOpen = true;
    onClose = jest.fn();
    onVersionSelect = jest.fn();
    assignedPolicy = {
      [chance.string()]: chance.string(),
      policyId: chance.guid(),
      policyName: chance.string(),
      policyVersion: chance.d100().toString(),
    };
    versions = chance
      .n(
        () => ({
          id: chance.guid(),
          created: chance.timestamp(),
        }),
        chance.d4() + 1
      )
      .map((version, index) => ({
        ...version,
        version: index + 1,
      }));
    paginatedFetchResponse = {
      data: versions,
      loading: false,
      isLastPage: false,
      goToNextPage: jest.fn(),
    };
    usePaginatedFetch.mockReturnValue(paginatedFetchResponse);
    format = jest.fn().mockReturnValue(chance.timestamp());
    dayjs.mockReturnValue({
      format,
    });
    const utils = render(
      <PolicyVersionDrawer
        isOpen={isOpen}
        onClose={onClose}
        assignedPolicy={assignedPolicy}
        onVersionSelect={onVersionSelect}
      />
    );
    rerender = utils.rerender;
  });

  it("should not call to get policy versions if no policy is specified", () => {
    usePaginatedFetch.mockClear();
    rerender(
      <PolicyVersionDrawer
        isOpen={isOpen}
        onClose={onClose}
        assignedPolicy={null}
        onVersionSelect={onVersionSelect}
      />
    );

    expect(usePaginatedFetch)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(null, {}, 15);
  });

  it("should call to get the policy versions for the assigned policy", () => {
    expect(usePaginatedFetch).toHaveBeenCalledWith(
      `/api/policies/${assignedPolicy.policyId}/versions`,
      {},
      15
    );
  });

  it("should show the policy name and drawer instructions", () => {
    expect(screen.getByText(assignedPolicy.policyName)).toBeInTheDocument();
    expect(
      screen.getByText("Target a specific version of this policy")
    ).toBeInTheDocument();
  });

  it("should show a version card for each found version", () => {
    versions.forEach((version, index) => {
      expect(screen.getAllByText("Version")[index]).toBeInTheDocument();
      expect(dayjs).toHaveBeenCalledWith(version.created);
      expect(format).toHaveBeenCalledWith(DATE_TIME_FORMAT);

      const renderedSelectButton = screen.getAllByText(/Select/i)[index];
      expect(renderedSelectButton).toBeInTheDocument();
      userEvent.click(renderedSelectButton);
      expect(onVersionSelect).toHaveBeenCalledWith(version, assignedPolicy);
    });
  });

  it("should show the selected version as selected to the user", () => {
    versions[0].version = assignedPolicy.policyVersion;
    rerender(
      <PolicyVersionDrawer
        isOpen={isOpen}
        onClose={onClose}
        assignedPolicy={assignedPolicy}
        onVersionSelect={onVersionSelect}
      />
    );

    const renderedButton = screen.getByLabelText("Selected");
    expect(renderedButton).toBeInTheDocument();
    expect(renderedButton).toBeDisabled();
  });

  it("should render a no versions found message if no versions exist", () => {
    paginatedFetchResponse.data = [];
    rerender(
      <PolicyVersionDrawer
        isOpen={isOpen}
        onClose={onClose}
        assignedPolicy={assignedPolicy}
        onVersionSelect={onVersionSelect}
      />
    );

    expect(screen.getByText("No versions found")).toBeInTheDocument();
  });

  it("should render a View More button when there are additional versions to retrieve", () => {
    const renderedButton = screen.getByLabelText("View More");
    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);

    expect(paginatedFetchResponse.goToNextPage).toHaveBeenCalledTimes(1);
  });
});
