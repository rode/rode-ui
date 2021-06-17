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
import CreateNewPolicyGroup from "pages/policy-groups/new";

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/useFormValidation");

describe("New Policy Group", () => {
  let router,
    fetchResponse,
    createdPolicyGroup,
    isValid,
    validationErrors,
    validateField,
    rerender;

  beforeEach(() => {
    router = {
      back: jest.fn(),
      push: jest.fn().mockResolvedValue({}),
    };
    createdPolicyGroup = {
      [chance.string()]: chance.string(),
      name: chance.string({ alpha: true, casing: "lower" }),
      description: chance.string(),
    };
    fetchResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(createdPolicyGroup),
    };
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
    global.fetch = jest.fn().mockResolvedValue(fetchResponse);
    const utils = render(<CreateNewPolicyGroup />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the name input", () => {
    const input = screen.getByLabelText(/name/i);
    expect(input).toBeInTheDocument();
  });

  it("should render the description input", () => {
    const input = screen.getByLabelText(/description/i);
    expect(input).toBeInTheDocument();
  });

  it("should render the save button for the form", () => {
    const saveButton = screen.getByText(/Save Policy Group/i);
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
        name: chance.string({ alpha: true, casing: "lower" }),
        description: chance.sentence(),
      };

      userEvent.type(screen.getByLabelText(/name/i), formData.name);
      userEvent.type(
        screen.getByLabelText(/description/i),
        formData.description
      );

      await act(async () => {
        await userEvent.click(screen.getByText(/save policy group/i));
      });
    });

    it("should call to validate the form", () => {
      expect(isValid).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(formData);
    });

    it("should submit the form when filled out entirely", () => {
      expect(fetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("/api/policy-groups", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
    });

    it("should redirect the user to the policy group dashboard", () => {
      expect(router.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("/policy-groups");
    });
  });

  describe("unsuccessful save", () => {
    it("should show a validation error when a required field is not filled out", async () => {
      isValid.mockReturnValue(false);
      validationErrors.name = chance.string();
      await userEvent.click(screen.getByText(/save policy group/i));

      expect(fetch).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();

      rerender(<CreateNewPolicyGroup />);
      expect(screen.getByText(validationErrors.name)).toBeInTheDocument();
      userEvent.click(screen.getByLabelText(/policy group name/i));
      userEvent.tab();

      expect(validateField).toHaveBeenCalledTimes(1);
    });

    it("should show an error when the call to create failed", async () => {
      fetchResponse.ok = false;
      await act(async () => {
        await userEvent.click(screen.getByText(/save policy group/i));
      });

      expect(showError)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("Failed to create the policy group.");
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
