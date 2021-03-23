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
import PolicyValidationResult from "components/policies/PolicyValidationResult";

describe("PolicyValidationResult", () => {
  let validation;

  describe("validation does not exist", () => {
    it("should return null", () => {
      validation = null;
      render(<PolicyValidationResult validation={validation} />);

      expect(screen.queryByText(/policy is/i)).not.toBeInTheDocument();
    });
  });

  describe("validation exists", () => {
    beforeEach(() => {
      validation = {
        isValid: chance.bool(),
        errors: chance.n(chance.string, chance.d4()),
      };
    });

    describe("policy is valid", () => {
      beforeEach(() => {
        validation.isValid = true;
        render(<PolicyValidationResult validation={validation} />);
      });

      it("should render a success message", () => {
        expect(screen.getByText(/policy is valid/i)).toBeInTheDocument();
        expect(screen.getByTitle(/badge check/i)).toBeInTheDocument();
      });
    });

    describe("policy is not valid", () => {
      beforeEach(() => {
        validation.isValid = false;
        render(<PolicyValidationResult validation={validation} />);
      });

      it("should render an error message", () => {
        expect(screen.getByText(/policy is invalid/i)).toBeInTheDocument();
        expect(screen.getByTitle(/exclamation/i)).toBeInTheDocument();
      });

      it("should render the errors that are returned", () => {
        validation.errors.forEach((error) => {
          expect(screen.getByText(error, { exact: false })).toBeInTheDocument();
        });
      });
    });
  });
});
