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

import { StatusCodes } from "http-status-codes";
import { post, RodeClientError } from "pages/api/utils/api-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  post: async (req, res) => {
    const policy = req.body;

    try {
      const response = await post(
        "/v1alpha1/policies:validate",
        policy,
        req.accessToken
      );

      const validatePolicyResponse = await response.json();

      const result = {
        errors: validatePolicyResponse.errors,
        isValid: validatePolicyResponse.compile,
      };

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      if (!(error instanceof RodeClientError)) {
        throw error;
      }

      const parsedResponse = JSON.parse(error.responseText);

      if (
        parsedResponse?.message?.includes("failed to compile") ||
        parsedResponse?.message?.includes("failed to parse") ||
        parsedResponse?.message?.includes("missing Rode required fields")
      ) {
        const validationError = {
          errors: parsedResponse.details[0].errors,
          isValid: false,
        };

        return res.status(StatusCodes.BAD_REQUEST).json(validationError);
      }

      throw error;
    }
  },
});
