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
import { render, screen, act } from "test/testing-utils/renderer";

import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { showError, showSuccess } from "utils/toast-utils";
import EditPolicyGroupAssignments from "pages/policy-groups/[name]/assignments";
import { usePolicyGroup } from "hooks/usePolicyGroup";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { mutate } from "swr";

jest.mock("swr");
jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/usePolicyGroup");
jest.mock("hooks/usePaginatedFetch");

describe("Edit Policy Group Assignments", () => {
  let router,
    usePolicyGroupResponse,
    policyGroup,
    currentAssignments,
    policySearchResults,
    assignments,
    policies,
    saveResponse,
    rerender;

  beforeEach(() => {
    const policyGroupName = chance.string({ alpha: true, casing: "lower" });
    router = {
      back: jest.fn(),
      push: jest.fn().mockResolvedValue({}),
      query: {
        name: policyGroupName,
      },
    };
    policyGroup = {
      [chance.string()]: chance.string(),
      name: policyGroupName,
    };
    assignments = chance.n(() => {
      const version = chance.d4().toString();
      const id = chance.guid();
      return {
        id: chance.guid(),
        policyVersionId: `${id}.${version}`,
        policyName: chance.string(),
        policyVersion: version,
        policyGroup: policyGroup.name,
        policyId: id,
        currentVersion: version,
      };
    }, chance.d4() + 1);
    policies = chance.n(() => {
      const version = chance.d4().toString();
      const id = chance.guid();
      return {
        id: `${id}.${version}`,
        policyName: chance.string(),
        policyVersion: version,
        policyVersionId: `${id}.${version}`,
        policyId: id,
        currentVersion: version,
      };
    }, chance.d4() + 1);
    currentAssignments = {
      data: assignments,
      loading: false,
    };
    policySearchResults = {
      data: policies,
      loading: false,
    };

    usePaginatedFetch.mockImplementation((endpoint) => {
      if (endpoint?.startsWith("/api/policy-groups")) {
        return currentAssignments;
      }
      return policySearchResults;
    });
    usePolicyGroupResponse = {
      policyGroup: policyGroup,
      loading: false,
    };
    saveResponse = {
      json: jest.fn().mockResolvedValue(policyGroup),
      ok: true,
    }; // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockResolvedValue(saveResponse);
    useRouter.mockReturnValue(router);
    usePolicyGroup.mockReturnValue(usePolicyGroupResponse);
    const utils = render(<EditPolicyGroupAssignments />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should get the saved policy group", () => {
    expect(usePolicyGroup).toHaveBeenCalledWith(router.query.name);
  });

  describe("policy group is not found", () => {
    beforeEach(() => {
      usePolicyGroupResponse.policyGroup = null;
      rerender(<EditPolicyGroupAssignments />);
    });

    it("should render the not found message", () => {
      expect(screen.getByText(/no policy group found/i)).toBeInTheDocument();
    });

    it("should not call the fetch assignments for the policy group", () => {
      expect(usePaginatedFetch).toHaveBeenCalledWith(null, {}, 50);
    });
  });

  describe("policy group exists", () => {
    it("should render the policy group name", () => {
      expect(screen.getByText(policyGroup.name)).toBeInTheDocument();
    });

    it("should call to get the assignments for the policy group", () => {
      expect(usePaginatedFetch).toHaveBeenCalledWith(
        `/api/policy-groups/${policyGroup.name}/assignments`,
        {},
        50
      );
    });

    it("should render a card for each currently policy assigned to the group", () => {
      expect(screen.getByText("Assigned Policies")).toBeInTheDocument();
      assignments.forEach((assignment, index) => {
        expect(screen.getByText(assignment.policyName)).toBeInTheDocument();
        expect(
          screen.getAllByLabelText("Remove Policy Assignment")[index]
        ).toBeInTheDocument();
      });
    });

    it("should render a message when no policies are assigned to the group", () => {
      usePaginatedFetch.mockImplementation((endpoint) => {
        if (endpoint?.startsWith("/api/policy-groups")) {
          return { data: [], loading: false };
        }
        return policySearchResults;
      });
      rerender(<EditPolicyGroupAssignments />);

      expect(
        screen.getByText("No policies are assigned to this policy group.")
      ).toBeInTheDocument();
    });

    it("should render the save button", () => {
      const saveButton = screen.getByLabelText("Save Assignments");
      expect(saveButton).toBeInTheDocument();
    });

    it("should render the cancel button", () => {
      const cancelButton = screen.getByText(/cancel/i);
      expect(cancelButton).toBeInTheDocument();

      userEvent.click(cancelButton);
      expect(router.back).toHaveBeenCalledTimes(1);
    });

    describe("creating a new assignment", () => {
      beforeEach(async () => {
        act(() => {
          userEvent.click(screen.getByLabelText("View all policies"));
        });
        act(() => {
          userEvent.click(
            screen.getAllByLabelText("Assign to Policy Group")[0]
          );
        });
        await act(async () => {
          await userEvent.click(screen.getByLabelText("Save Assignments"));
        });
      });

      it("should call the correct endpoint", () => {
        expect(fetch).toHaveBeenCalledWith(
          `/api/policy-groups/${policyGroup.name}/assignments`,
          {
            method: "POST",
            body: expect.stringContaining("ADD"),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      });

      it("should show a success message", () => {
        expect(showSuccess).toHaveBeenCalledWith("Saved!");
      });

      it("should redirect the user to the updated policy group assignments page", () => {
        expect(mutate).toHaveBeenCalledWith(
          `/api/policy-groups/${policyGroup.name}/assignments`
        );
        expect(router.push)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`/policy-groups/${policyGroup.name}`);
      });
    });

    describe("removing an assignment", () => {
      beforeEach(async () => {
        act(() =>
          userEvent.click(
            screen.getAllByLabelText("Remove Policy Assignment")[0]
          )
        );

        await act(async () => {
          await userEvent.click(screen.getByLabelText("Save Assignments"));
        });
      });

      it("should call the correct endpoint", () => {
        expect(fetch).toHaveBeenCalledWith(
          `/api/policy-groups/${
            policyGroup.name
          }/assignments/${encodeURIComponent(assignments[0].id)}`,
          {
            method: "DELETE",
          }
        );
      });

      it("should show a success message", () => {
        expect(showSuccess).toHaveBeenCalledWith("Saved!");
      });

      it("should redirect the user to the updated policy group assignments page", () => {
        expect(mutate).toHaveBeenCalledWith(
          `/api/policy-groups/${policyGroup.name}/assignments`
        );
        expect(router.push)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`/policy-groups/${policyGroup.name}`);
      });
    });

    describe("unsuccessful save", () => {
      it("should show an error when the call to save failed", async () => {
        saveResponse.ok = false;
        act(() =>
          userEvent.click(
            screen.getAllByLabelText("Remove Policy Assignment")[0]
          )
        );

        await act(async () => {
          await userEvent.click(screen.getByLabelText("Save Assignments"));
        });

        expect(showError)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith("Failed to save policy group assignments.");
        expect(showSuccess).not.toHaveBeenCalled();
        expect(router.push).not.toHaveBeenCalled();
      });
    });
  });
});
