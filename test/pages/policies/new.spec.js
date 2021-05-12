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

import NewPolicy from "pages/policies/new";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { useFormValidation } from "hooks/useFormValidation";
import { showError } from "utils/toast-utils";

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/useFormValidation");

describe("New Policy", () => {
  let router,
    fetchResponse,
    createdPolicy,
    isValid,
    validationErrors,
    validateField,
    dispatchMock,
    rerender;

  beforeEach(() => {
    router = {
      back: jest.fn(),
      push: jest.fn().mockResolvedValue({}),
    };
    createdPolicy = {
      [chance.string()]: chance.string(),
      id: chance.guid(),
    };
    fetchResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(createdPolicy),
    };
    dispatchMock = jest.fn();
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
    const utils = render(<NewPolicy />, { policyDispatch: dispatchMock });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the save button for the form", () => {
    const saveButton = screen.getByText(/Save Policy/i);
    expect(saveButton).toBeInTheDocument();
  });

  it("should auto-populate an example policy", () => {
    const examplePolicy = screen.getByText(/This is an example policy./i, {
      exact: false,
      selector: "textarea",
    });

    expect(examplePolicy).toBeInTheDocument();
  });

  describe("successful save", () => {
    let formData;

    beforeEach(async () => {
      formData = {
        name: chance.string(),
        description: chance.sentence(),
        regoContent: chance.string(),
      };

      userEvent.type(screen.getByLabelText(/policy name/i), formData.name);
      userEvent.type(
        screen.getByLabelText(/description/i),
        formData.description
      );

      const rego = screen.getByLabelText(/rego policy code/i);
      userEvent.clear(rego);
      userEvent.type(rego, formData.regoContent);

      await act(async () => {
        await userEvent.click(screen.getByText(/save policy/i));
      });
    });

    it("should call to validate the form", () => {
      expect(isValid).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(formData);
    });

    it("should submit the form when filled out entirely", () => {
      expect(fetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("/api/policies", {
          method: "POST",
          body: JSON.stringify(formData),
        });
    });

    it("should save the created policy in state", () => {
      expect(dispatchMock).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        type: "SET_CURRENT_POLICY",
        data: createdPolicy,
      });
    });

    it("should redirect the user to the created policy page", () => {
      expect(router.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies/${createdPolicy.id}`);
    });
  });

  describe("unsuccessful save", () => {
    it("should show a validation error when a required field is not filled out", async () => {
      isValid.mockReturnValue(false);
      validationErrors.name = chance.string();
      await userEvent.click(screen.getByText(/save policy/i));

      expect(fetch).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();

      rerender(<NewPolicy />);
      expect(screen.getByText(validationErrors.name)).toBeInTheDocument();
      userEvent.click(screen.getByLabelText(/policy name/i));
      userEvent.tab();

      expect(validateField).toHaveBeenCalledTimes(1);
    });

    it("should show an error when the call to create failed due to invalid rego code", async () => {
      const expectedError = {
        isValid: false,
        errors: chance.n(chance.string, chance.d4()),
      };
      fetchResponse.ok = false;
      fetchResponse.json.mockResolvedValue(expectedError);

      await act(async () => {
        await userEvent.click(screen.getByText(/save policy/i));
      });

      expect(showError)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(
          "Failed to create the policy due to invalid Rego code. See error(s) below for details."
        );

      expect(
        screen.getByText(/this policy failed validation/i)
      ).toBeInTheDocument();
    });

    it("should show an error when the call to create failed", async () => {
      fetchResponse.ok = false;
      await act(async () => {
        await userEvent.click(screen.getByText(/save policy/i));
      });

      expect(showError)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("Failed to create the policy.");
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
