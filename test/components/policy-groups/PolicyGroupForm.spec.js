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

import PolicyGroupForm from "components/policy-groups/PolicyGroupForm";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { useFormValidation } from "hooks/useFormValidation";

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
      verb: chance.pickone(["update", "create"]),
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
    render(<PolicyGroupForm {...formProps} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the title for the form", () => {
    expect(screen.getByText(formProps.title)).toBeInTheDocument();
  });

  it("should render the policy group name input", () => {
    const renderedInput = screen.getByLabelText("Policy Group Name");

    expect(renderedInput).toBeInTheDocument();
  });

  it("should render the policy group description input", () => {
    const renderedInput = screen.getByLabelText("Description");

    expect(renderedInput).toBeInTheDocument();

    userEvent.type(renderedInput, chance.character());
    userEvent.tab();
    expect(validateField).toHaveBeenCalled();
  });

  it("should render a cancel button for the form", () => {
    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();

    userEvent.click(cancelButton);
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
