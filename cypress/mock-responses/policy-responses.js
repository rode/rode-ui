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

export const mockFailedPolicyValidation = {
  isValid: false,
  errors: ["Invalid rego code"],
};

export const mockSuccessPolicyValidation = {
  isValid: true,
  errors: null,
};

export const mockFailedPatchPolicyResponse = {
  errors: ["Invalid rego code"],
};

export const mockSuccessPolicyEvaluation = {
  pass: true,
  result: [
    {
      violations: [
        {
          pass: true,
          message: "This rule passed.",
        },
      ],
    },
  ],
  explanation: {
    0: "This is a passing evaluation explanation",
  },
};

export const mockFailedPolicyEvaluation = {
  pass: false,
  result: [
    {
      violations: [
        {
          pass: false,
          message: "This rule failed.",
        },
      ],
    },
  ],
  explanation: {
    0: "This is a failed evaluation explanation",
  },
};
