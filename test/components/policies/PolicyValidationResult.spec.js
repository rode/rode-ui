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
  let validation, rerender;

  beforeEach(() => {
    validation = {
      isValid: chance.bool(),
      errors: chance.n(() => chance.word({ syllables: 4 }), chance.d4()),
    };
    const utils = render(<PolicyValidationResult validation={validation} />);
    rerender = utils.rerender;
  });

  describe("validation does not exist", () => {
    it("should return null", () => {
      validation = null;
      rerender(<PolicyValidationResult validation={validation} />);

      expect(screen.queryByText(/policy is/i)).not.toBeInTheDocument();
    });
  });

  describe("validation exists", () => {
    describe("policy is valid", () => {
      beforeEach(() => {
        validation.isValid = true;
        rerender(<PolicyValidationResult validation={validation} />);
      });

      it("should render a success message", () => {
        expect(
          screen.getByText("This policy passes validation.")
        ).toBeInTheDocument();
        expect(screen.getByTitle(/badge check/i)).toBeInTheDocument();
      });
    });

    describe("policy is not valid", () => {
      beforeEach(() => {
        validation.isValid = false;
        rerender(<PolicyValidationResult validation={validation} />);
      });

      it("should render an error message", () => {
        expect(
          screen.getByText("This policy failed validation.")
        ).toBeInTheDocument();
        expect(screen.getByTitle(/exclamation/i)).toBeInTheDocument();
      });

      it("should render the errors that are returned if they are present", () => {
        expect(
          screen.getByText(/this policy failed validation/i).closest("pre")
        ).toBeDefined();

        validation.errors.forEach((error) => {
          expect(screen.getByText(error, { exact: false })).toBeInTheDocument();
        });
      });

      it("should not render any errors if they are not present", () => {
        validation.errors = [];
        rerender(<PolicyValidationResult validation={validation} />);
        expect(
          screen.getByText(/this policy failed validation/i).closest("pre")
        ).not.toBeInTheDocument();
      });
    });
  });
});
