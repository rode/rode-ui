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

import NewPolicy from "pages/policies/new";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { useFormValidation } from "hooks/useFormValidation";

jest.mock("next/router");
jest.mock("hooks/useFormValidation");

describe("New Policy", () => {
  let router, fetchResponse, createdPolicy, isValid, validationErrors, rerender;

  beforeEach(() => {
    router = {
      back: jest.fn(),
      push: jest.fn(),
    };
    createdPolicy = {
      [chance.string()]: chance.string(),
      id: chance.guid(),
    };
    fetchResponse = {
      ok: true,
      json: jest.fn().mockReturnValue(createdPolicy),
    };
    isValid = jest.fn().mockReturnValue(true);
    validationErrors = {};
    useFormValidation.mockReturnValue({
      isValid,
      errors: validationErrors,
    });
    useRouter.mockReturnValue(router);
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockResolvedValue(fetchResponse);
    const utils = render(<NewPolicy />);
    rerender = utils.rerender;
  });

  it("should render the policy name input", () => {
    const renderedInput = screen.getByLabelText("Policy Name");

    expect(renderedInput).toBeInTheDocument();
  });

  it("should render the policy description input", () => {
    const renderedInput = screen.getByLabelText("Description");

    expect(renderedInput).toBeInTheDocument();
  });

  it("should render the policy code input", () => {
    const renderedTextArea = screen.getByLabelText("Rego Policy Code");

    expect(renderedTextArea).toBeInTheDocument();
  });

  it("should render a help link to the rego documentation", () => {
    const renderedText = screen.getByText(/rego documentation/i);

    expect(renderedText).toBeInTheDocument();
    expect(renderedText).toHaveAttribute(
      "href",
      "https://www.openpolicyagent.org/docs/latest/policy-language/"
    );
  });

  it("should render the save button for the form", () => {
    const saveButton = screen.getByText(/Save Policy/i);
    expect(saveButton).toBeInTheDocument();
  });

  it("should render a cancel button for the form", () => {
    const cancelButton = screen.getByText(/cancel/i);
    expect(cancelButton).toBeInTheDocument();

    userEvent.click(cancelButton);
    expect(router.back).toHaveBeenCalledTimes(1);
  });

  describe("successful save", () => {
    let formData;

    beforeEach(() => {
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
      userEvent.type(
        screen.getByLabelText(/rego policy code/i),
        formData.regoContent
      );

      userEvent.click(screen.getByText(/save policy/i));
    });

    it("should submit the form when filled out entirely", () => {
      expect(fetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("/api/policies", {
          method: "POST",
          body: JSON.stringify(formData),
        });
    });

    it("should redirect the user to the created policies page", () => {
      expect(router.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/policies/${createdPolicy.id}`);
    });
  });

  describe("unsuccessful save", () => {
    it("should show a validation error when a required field is not filled out", () => {
      isValid.mockReturnValue(false);
      validationErrors.name = chance.string();
      userEvent.click(screen.getByText(/save policy/i));

      expect(fetch).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();

      rerender(<NewPolicy />);
      expect(screen.getByText(validationErrors.name)).toBeInTheDocument();
    });

    it("should show an error when the call to create failed", () => {
      fetchResponse.ok = false;
      userEvent.click(screen.getByText(/save policy/i));

      // TODO: add test guts for showing error message when implemented

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
