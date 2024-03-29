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
import { render, screen, act, within } from "test/testing-utils/renderer";

import EditPolicy from "pages/policies/[id]/edit";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { useFormValidation } from "hooks/useFormValidation";
import { usePolicy } from "hooks/usePolicy";
import { showError, showSuccess } from "utils/toast-utils";
import Prism from "prism/prism";
import { mutate } from "swr";
import { waitFor } from "@testing-library/dom";
import { AUTHORIZATION_ERROR_MESSAGE } from "utils/constants";

jest.mock("swr");
jest.mock("next/router");
jest.mock("utils/toast-utils");
jest.mock("hooks/useFormValidation");
jest.mock("hooks/usePolicy");
jest.mock("prism/prism");

describe("Edit Policy", () => {
  let router,
    fetchResponse,
    policy,
    isValid,
    validationErrors,
    validateField,
    mockUsePolicy,
    dispatch,
    scrollMock,
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
    dispatch = jest.fn();
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
    scrollMock = jest.fn();
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: scrollMock,
    });
    mutate.mockResolvedValue({});

    Prism.highlight = jest.fn().mockReturnValue(`\n ${chance.string()} \n`);
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockResolvedValue(fetchResponse);
    const utils = render(<EditPolicy />, { dispatch: dispatch });
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch the policy data for the id in the url", () => {
    expect(usePolicy).toHaveBeenCalledWith(policy.id);
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

  it("should render a button to delete the policy", () => {
    const deleteButton = screen.getByText(/delete policy/i);
    expect(deleteButton).toBeInTheDocument();
  });

  describe("deleting a policy", () => {
    it("should show the modal to confirm deletion", () => {
      const deleteButton = screen.getByText(/delete policy/i);
      expect(deleteButton).toBeInTheDocument();

      act(() => {
        userEvent.click(deleteButton);
      });

      const renderedConfirmationModal = screen.getByRole("dialog");
      expect(renderedConfirmationModal).toBeInTheDocument();

      expect(screen.getByText(/confirm policy deletion/i)).toBeInTheDocument();
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      expect(
        within(renderedConfirmationModal).getByText(/cancel/i)
      ).toBeInTheDocument();
      expect(
        within(renderedConfirmationModal).getByText(/delete policy/i)
      ).toBeInTheDocument();
    });

    it("should allow the user to close out of the confirmation without taking action", () => {
      const deleteButton = screen.getByText(/delete policy/i);

      act(() => {
        userEvent.click(deleteButton);
      });

      const renderedConfirmationModal = screen.getByRole("dialog");
      const cancelButton = within(renderedConfirmationModal).getByLabelText(
        /cancel/i
      );
      expect(cancelButton).toBeInTheDocument();

      act(() => {
        userEvent.click(cancelButton);
      });

      expect(renderedConfirmationModal).not.toBeInTheDocument();
    });

    it("should allow the user to close out of the confirmation by closing the modal", () => {
      const deleteButton = screen.getByText(/delete policy/i);

      act(() => {
        userEvent.click(deleteButton);
      });

      const renderedConfirmationModal = screen.getByRole("dialog");
      const modalCloseButton = within(renderedConfirmationModal).getByTitle(
        /x circle/i
      );
      expect(modalCloseButton).toBeInTheDocument();

      act(() => {
        userEvent.click(modalCloseButton);
      });

      expect(renderedConfirmationModal).not.toBeInTheDocument();
    });

    it("should call to the correct endpoint when prompted to delete", () => {
      act(() => {
        userEvent.click(screen.getByText(/delete policy/i));
      });

      const renderedConfirmationModal = screen.getByRole("dialog");
      const confirmDeleteButton = within(renderedConfirmationModal).getByText(
        /delete policy/i
      );
      userEvent.click(confirmDeleteButton);
      expect(fetch).toHaveBeenCalledWith(`/api/policies/${policy.id}`, {
        method: "DELETE",
      });
    });

    it("should show a success message and redirect when deletion was successful", async () => {
      act(() => {
        userEvent.click(screen.getByText(/delete policy/i));
      });
      const renderedConfirmationModal = screen.getByRole("dialog");
      const confirmDeleteButton = within(renderedConfirmationModal).getByText(
        /delete policy/i
      );
      await act(async () => {
        await userEvent.click(confirmDeleteButton);
      });

      expect(showSuccess)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("Policy was successfully deleted.");
      expect(router.push)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("/policies");
    });

    it("should show an error message when deletion failed to complete", async () => {
      fetchResponse.ok = false;

      act(() => {
        userEvent.click(screen.getByText(/delete policy/i));
      });
      const renderedConfirmationModal = screen.getByRole("dialog");
      const confirmDeleteButton = within(renderedConfirmationModal).getByText(
        /delete policy/i
      );
      await act(async () => {
        await userEvent.click(confirmDeleteButton);
      });

      expect(showError)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(
          "An error occurred while deleting the policy. Please try again."
        );
      expect(router.push).not.toHaveBeenCalled();
    });

    it("should show an error message when the user is unauthorized", async () => {
      fetchResponse.ok = false;
      fetchResponse.status = StatusCodes.FORBIDDEN;

      act(() => {
        userEvent.click(screen.getByText(/delete policy/i));
      });
      const renderedConfirmationModal = screen.getByRole("dialog");
      const confirmDeleteButton = within(renderedConfirmationModal).getByText(
        /delete policy/i
      );
      await act(async () => {
        await userEvent.click(confirmDeleteButton);
      });

      expect(showError)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(AUTHORIZATION_ERROR_MESSAGE);
    });
  });

  describe("updating the policy and creating a new version", () => {
    beforeEach(() => {
      act(() =>
        userEvent.type(screen.getByText("Rego Policy Code"), chance.string())
      );

      userEvent.click(screen.getByText(/update policy/i));
    });

    it("should show the update message modal", () => {
      expect(
        screen.getByText(
          "By updating the Rego Policy Code, you are creating a new version of this policy."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Attach an optional message to this version of the policy, describing the changes that were made."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText("Policy Update Message", { selector: "h1" })
      ).toBeInTheDocument();
    });

    it("should show an input for the user to specific an update message", () => {
      const renderedInput = screen.getByText("Policy Update Message", {
        selector: "label",
      });
      expect(renderedInput).toBeInTheDocument();
      userEvent.type(renderedInput, chance.string());
    });

    it("should close the modal when pressing the cancel button", () => {
      const renderedCancel = screen.getByTestId("cancelUpdate");
      userEvent.click(renderedCancel);

      expect(
        screen.queryByText("Policy Update Message")
      ).not.toBeInTheDocument();
    });

    it("should close the modal when pressing the close button", () => {
      const renderedClose = screen.getByLabelText("Close Modal");
      userEvent.click(renderedClose);

      expect(
        screen.queryByText("Policy Update Message")
      ).not.toBeInTheDocument();
    });

    it("should submit the form when the user confirms update", async () => {
      const renderedSubmit = screen.getByLabelText("Update & Save Policy");
      await act(async () => {
        await userEvent.click(renderedSubmit);
      });

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    });
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
        message: "",
      });
    });

    it("should submit the form when filled out entirely", () => {
      const formData = {
        name: policy.name,
        description: policy.description,
        regoContent: policy.regoContent,
        message: "",
      };
      expect(fetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(`/api/policies/${policy.id}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
    });

    it("should save the updated policy in state", () => {
      expect(dispatch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        type: "SET_CURRENT_POLICY",
        data: policy,
      });
    });

    it("should update the list of policy versions", () => {
      expect(mutate).toHaveBeenCalledWith(
        `/api/policies/${policy.id}/versions`
      );
    });

    it("should redirect the user to the updated policy page", async () => {
      await waitFor(() =>
        expect(router.push)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`/policies/${policy.id}`)
      );
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

    it("should show an error when the call to update fails due to invalid Rego code", async () => {
      const expectedError = {
        isValid: false,
        errors: chance.n(() => chance.string({ alpha: true }), chance.d4()),
      };
      fetchResponse.ok = false;
      fetchResponse.json.mockResolvedValue(expectedError);

      await userEvent.click(screen.getByText(/update policy/i));

      await waitFor(() =>
        expect(showError)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            "Failed to update the policy due to invalid Rego code. See error(s) below for details."
          )
      );

      expectedError.errors.forEach((error) => {
        expect(screen.getByText(error, { exact: false })).toBeInTheDocument();
      });
    });

    it("should show an error when the call to update failed", async () => {
      fetchResponse.ok = false;
      await userEvent.click(screen.getByText(/update policy/i));

      await waitFor(() =>
        expect(showError)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith("Failed to update the policy.")
      );
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalled();
    });

    it("should show an error when the user is not authorized", async () => {
      fetchResponse.ok = false;
      fetchResponse.status = StatusCodes.FORBIDDEN;

      await userEvent.click(screen.getByText(/update policy/i));

      await waitFor(() => {
        expect(showError)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(AUTHORIZATION_ERROR_MESSAGE);
      });
    });
  });
});
