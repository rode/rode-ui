import React from "react";
import { render, screen } from "@testing-library/react";
import FormValidationComponent from "test/testing-utils/hook-components/useFormValidationComponent";
import userEvent from "@testing-library/user-event";

describe("useFormValidation", () => {
  let rerender;

  beforeEach(() => {
    const utils = render(<FormValidationComponent />);
    rerender = utils.rerender;
  });

  it("should validate the schema when prompted", () => {
    const validateButton = screen.getByText("Validate Form");
    userEvent.click(validateButton);

    rerender(<FormValidationComponent />);
    const validationError = screen.queryByTestId("validation-error");

    expect(validationError).toBeInTheDocument();
    expect(validationError).toHaveTextContent("field is a required field");

    userEvent.type(screen.getByLabelText("Field Label"), chance.string());
    userEvent.click(validateButton);

    rerender(<FormValidationComponent />);
    expect(validationError).not.toBeInTheDocument();
  });

  it("should validate the field when prompted", () => {
    const validateButton = screen.getByText("Validate Form");
    const input = screen.getByLabelText("Field Label");

    userEvent.type(input, chance.string());
    userEvent.click(validateButton);

    userEvent.clear(input);
    userEvent.tab();

    rerender(<FormValidationComponent />);
    const validationError = screen.queryByTestId("validation-error");

    expect(validationError).toBeInTheDocument();
    expect(validationError).toHaveTextContent("field is a required field");
  });
});
