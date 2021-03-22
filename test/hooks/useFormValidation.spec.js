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
