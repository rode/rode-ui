import React from "react";
import { render, screen } from "test/testing-utils/renderer";

import NewPolicy from "pages/policies/new";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

jest.mock("next/router");

describe("New Policy", () => {
  let router, fetchResponse, createdPolicy;

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
    useRouter.mockReturnValue(router);
    // eslint-disable-next-line no-undef
    global.fetch = jest.fn().mockResolvedValue(fetchResponse);
    render(<NewPolicy />);
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
    beforeEach(() => {
      fetchResponse.ok = false;
    });

    it("should show a validation error when a required field is not filled out", () => {
      // TODO: figure out how to do validation here - joi and homemade hook?
    });

    it("should show an error when the call to create failed", () => {
      userEvent.click(screen.getByText(/save policy/i));
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
