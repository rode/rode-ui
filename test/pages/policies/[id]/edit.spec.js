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

import EditPolicy from "pages/policies/[id]/edit";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { useFormValidation } from "hooks/useFormValidation";
import { usePolicy } from "hooks/usePolicy";
import { showError } from "utils/toast-utils";

jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/useFormValidation");
jest.mock("hooks/usePolicy");

describe("Edit Policy", () => {
  let router,
    fetchResponse,
    policy,
    isValid,
    validationErrors,
    validateField,
    mockUsePolicy,
    dispatchMock,
    rerender;

  beforeEach(() => {
    router = {
      back: jest.fn(),
      push: jest.fn().mockResolvedValue({}),
      query: {
        id: chance.guid(),
      },
    };
    policy = {
      [chance.string()]: chance.string(),
      id: router.query.id,
      name: chance.string(),
      description: chance.sentence(),
      regoContent: chance.string(),
    };
    dispatchMock = jest.fn();
    fetchResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(policy),
    };
    isValid = jest.fn().mockReturnValue(true);
    validateField = jest.fn().mockReturnValue({});
    validationErrors = {};
    useFormValidation.mockReturnValue({
      isValid,
      errors: validationErrors,
      validateField,
    });
    mockUsePolicy = {
      policy,
      loading: false,
    };
    usePolicy.mockReturnValue(mockUsePolicy);
    useRouter.mockReturnValue(router);
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockResolvedValue(fetchResponse);
    const utils = render(<EditPolicy />, { policyDispatch: dispatchMock });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch the policy data for the id in the url", () => {
    expect(usePolicy).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(policy.id);
  });

  it("should render a loading indicator while the data is being fetched", () => {
    mockUsePolicy.loading = true;
    rerender(<EditPolicy />);
    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render a not found message if the policy does not exist", () => {
    mockUsePolicy.policy = null;
    rerender(<EditPolicy />);

    expect(screen.getByText(/no policy found under/i)).toBeInTheDocument();
  });

  it("should prefill the inputs when the policy is loaded", () => {
    expect(screen.getByLabelText(/policy name/i)).toHaveValue(policy.name);
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      policy.description
    );
    expect(screen.getByLabelText(/rego/i)).toHaveValue(policy.regoContent);
  });

  it("should render the save button for the form", () => {
    const saveButton = screen.getByText(/update Policy/i);
    expect(saveButton).toBeInTheDocument();
  });

  describe("successful save", () => {
    beforeEach(async () => {
      await act(async () => {
        await userEvent.click(screen.getByText(/update policy/i));
      });
    });

    it("should call to validate the form", () => {
      expect(isValid).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        name: policy.name,
        description: policy.description,
        regoContent: policy.regoContent,
      });
    });

    it("should submit the form when filled out entirely", () => {
      expect(fetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/api/policies/${policy.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: policy.name,
            description: policy.description,
            regoContent: policy.regoContent,
          }),
        });
    });

    it("should save the updated policy in state", () => {
      expect(dispatchMock).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        type: "SET_CURRENT_POLICY",
        data: policy,
      });
    });

    it("should redirect the user to the updated policy page", () => {
      expect(router.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies/${policy.id}`);
    });
  });

  describe("unsuccessful save", () => {
    it("should show a validation error when a required field is not filled out", async () => {
      isValid.mockReturnValue(false);
      validationErrors.name = chance.string();
      await userEvent.click(screen.getByText(/update policy/i));

      expect(fetch).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();

      rerender(<EditPolicy />);
      expect(screen.getByText(validationErrors.name)).toBeInTheDocument();
      userEvent.click(screen.getByLabelText(/policy name/i));
      userEvent.tab();

      expect(validateField).toHaveBeenCalledTimes(1);
    });

    it("should show an error when the call to update fails due to invalid rego code", async () => {
      const expectedError = {
        isValid: false,
        errors: chance.n(chance.string, chance.d4()),
      };
      fetchResponse.ok = false;
      fetchResponse.json.mockResolvedValue(expectedError);

      await act(async () => {
        await userEvent.click(screen.getByText(/update policy/i));
      });

      expect(showError)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(
          "Failed to update the policy due to invalid Rego code. See error(s) below for details."
        );

      expectedError.errors.forEach((error) => {
        expect(screen.getByText(error, { exact: false })).toBeInTheDocument();
      });
    });

    it("should show an error when the call to update failed", async () => {
      fetchResponse.ok = false;
      await act(async () => {
        await userEvent.click(screen.getByText(/update policy/i));
      });

      expect(showError)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("Failed to update the policy.");
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});