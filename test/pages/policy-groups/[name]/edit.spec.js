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
import { useFormValidation } from "hooks/useFormValidation";
import { showError } from "utils/toast-utils";
import EditPolicyGroup from "pages/policy-groups/[name]/edit";
import { usePolicyGroup } from "hooks/usePolicyGroup";

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/useFormValidation");
jest.mock("hooks/usePolicyGroup");

describe("Edit Policy Group", () => {
  let router,
    usePolicyGroupResponse,
    updatedPolicyGroup,
    isValid,
    validationErrors,
    validateField,
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
    updatedPolicyGroup = {
      [chance.string()]: chance.string(),
      name: policyGroupName,
      description: chance.string(),
    };
    usePolicyGroupResponse = {
      policyGroup: updatedPolicyGroup,
      loading: false,
    };
    saveResponse = {
      json: jest.fn().mockResolvedValue(updatedPolicyGroup),
      ok: true,
    };
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockResolvedValue(saveResponse);
    isValid = jest.fn().mockReturnValue(true);
    validateField = jest.fn().mockReturnValue({});
    validationErrors = {};
    useFormValidation.mockReturnValue({
      isValid,
      errors: validationErrors,
      validateField,
    });
    useRouter.mockReturnValue(router);
    // eslint-disable-next-line no-undef
    usePolicyGroup.mockReturnValue(usePolicyGroupResponse);
    const utils = render(<EditPolicyGroup />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should get the saved policy group", () => {
    expect(usePolicyGroup).toHaveBeenCalledWith(router.query.name);
  });

  describe("policy is not found", () => {
    it("should render the not found message", () => {
      usePolicyGroupResponse.policyGroup = null;
      rerender(<EditPolicyGroup />);

      expect(screen.getByText(/no policy group found/i)).toBeInTheDocument();
    });
  });

  describe("policy exists", () => {
    it("should render the name input", () => {
      const input = screen.getByLabelText(/name/i);
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
      expect(input).toHaveValue(updatedPolicyGroup.name);
    });

    it("should render the description input", () => {
      const input = screen.getByLabelText(/description/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(updatedPolicyGroup.description);
    });

    it("should render the save button for the form", () => {
      const saveButton = screen.getByText(/Update Policy Group/i);
      expect(saveButton).toBeInTheDocument();
    });

    it("should render the cancel button", () => {
      const cancelButton = screen.getByText(/cancel/i);
      expect(cancelButton).toBeInTheDocument();

      userEvent.click(cancelButton);
      expect(router.back).toHaveBeenCalledTimes(1);
    });

    describe("successful save", () => {
      let formData;

      beforeEach(async () => {
        formData = {
          name: updatedPolicyGroup.name,
          description: updatedPolicyGroup.description,
        };

        const renderedDescription = screen.getByLabelText(/description/i);
        userEvent.clear(renderedDescription);
        userEvent.type(renderedDescription, formData.description);

        await act(async () => {
          await userEvent.click(screen.getByText(/update policy group/i));
        });
      });

      it("should call to validate the form", () => {
        expect(isValid).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(formData);
      });

      it("should submit the form when filled out entirely", () => {
        expect(fetch)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `/api/policy-groups/${updatedPolicyGroup.name}`,
            {
              method: "PATCH",
              body: JSON.stringify(formData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
      });

      it("should redirect the user to the updated policy group page", () => {
        expect(router.push)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`/policy-groups/${updatedPolicyGroup.name}`);
      });
    });

    describe("unsuccessful save", () => {
      it("should show an error when the call to update failed", async () => {
        saveResponse.ok = false;
        await act(async () => {
          await userEvent.click(screen.getByText(/update policy group/i));
        });

        expect(showError)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith("Failed to update the policy group.");
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(router.push).not.toHaveBeenCalled();
      });
    });
  });
});
