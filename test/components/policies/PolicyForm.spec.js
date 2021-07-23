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
import { StatusCodes } from "http-status-codes";
import { render, screen, act } from "test/testing-utils/renderer";

import PolicyForm from "components/policies/PolicyForm";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { useFormValidation } from "hooks/useFormValidation";
import { AUTHORIZATION_ERROR_MESSAGE } from "utils/constants";
import { showError } from "utils/toast-utils";

jest.mock("utils/toast-utils");
jest.mock("next/router");
jest.mock("hooks/useFormValidation");

describe("Policy Form", () => {
  let router,
    fetchResponse,
    createdPolicy,
    isValid,
    validationErrors,
    validateField,
    formProps;

  beforeEach(() => {
    formProps = {
      title: chance.string(),
      method: chance.pickone(["POST", "PATCH"]),
      endpoint: chance.url(),
      verb: chance.word(),
      submitButtonText: chance.word(),
    };
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
    render(<PolicyForm {...formProps} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the title for the form", () => {
    expect(screen.getByText(formProps.title)).toBeInTheDocument();
  });

  it("should render the policy name input", () => {
    const renderedInput = screen.getByLabelText("Policy Name");

    expect(renderedInput).toBeInTheDocument();
    userEvent.type(renderedInput, chance.character());
    userEvent.tab();
    expect(validateField).toHaveBeenCalled();
  });

  it("should render the policy description input", () => {
    const renderedInput = screen.getByLabelText("Description");

    expect(renderedInput).toBeInTheDocument();

    userEvent.type(renderedInput, chance.character());
    userEvent.tab();
    expect(validateField).toHaveBeenCalled();
  });

  it("should render the policy code input", () => {
    const renderedTextArea = screen.getByLabelText("Rego Policy Code");

    expect(renderedTextArea).toBeInTheDocument();
    userEvent.type(renderedTextArea, chance.character());
    userEvent.click(screen.getByLabelText("Policy Name"));
    expect(validateField).toHaveBeenCalled();
  });

  it("should render a help link to the Rego documentation", () => {
    const renderedText = screen.getByText(/rego documentation/i);

    expect(renderedText).toBeInTheDocument();
    expect(renderedText).toHaveAttribute(
      "href",
      "https://www.openpolicyagent.org/docs/latest/policy-language/"
    );
  });

  it("should render a cancel button for the form", () => {
    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();

    userEvent.click(cancelButton);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  describe("policy validation", () => {
    let validationResponse, regoContent;

    beforeEach(() => {
      regoContent = chance.string();
      validationResponse = {
        isValid: false,
        errors: chance.n(chance.string, chance.d4()),
      };
      fetchResponse.json.mockResolvedValue(validationResponse);
    });

    it("should render a button to validate the policy", () => {
      expect(screen.getByText(/validate policy/i)).toBeInTheDocument();
    });

    it("should call to validate the policy code", async () => {
      userEvent.type(screen.getByLabelText(/rego policy code/i), regoContent);
      await act(async () => {
        await userEvent.click(screen.getByText(/validate policy/i));
      });

      expect(fetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("/api/policies/validate", {
          method: "POST",
          body: JSON.stringify({
            policy: regoContent,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
    });

    it("should show the validation results after validating the policy", async () => {
      userEvent.type(screen.getByLabelText(/rego policy code/i), regoContent);
      await act(async () => {
        await userEvent.click(screen.getByText(/validate policy/i));
      });

      expect(
        screen.getByText(/this policy failed validation/i)
      ).toBeInTheDocument();
    });

    describe("user is unauthorized", () => {
      it("should render an error message", async () => {
        fetchResponse.ok = false;
        fetchResponse.status = StatusCodes.FORBIDDEN;

        userEvent.type(screen.getByLabelText(/rego policy code/i), regoContent);
        await act(async () => {
          await userEvent.click(screen.getByText(/validate policy/i));
        });

        expect(showError)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(AUTHORIZATION_ERROR_MESSAGE);
        expect(fetchResponse.json).not.toHaveBeenCalled();
      });
    });
  });
});
