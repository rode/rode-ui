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
import { del, get, patch, RodeClientError } from "pages/api/utils/api-utils";
import { mapToApiModel, mapToClientModel } from "pages/api/utils/policy-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  get: async (req, res) => {
    const { id } = req.query;

    try {
      const response = await get(`/v1alpha1/policies/${id}`, req.accessToken);
      const getPolicyResponse = await response.json();
      const policy = mapToClientModel(getPolicyResponse);

      return res.status(StatusCodes.OK).json(policy);
    } catch (error) {
      if (
        error instanceof RodeClientError &&
        error.statusCode === StatusCodes.NOT_FOUND
      ) {
        return res.status(StatusCodes.OK).send(null);
      }

      throw error;
    }
  },
  patch: async (req, res) => {
    const { id } = req.query;

    const updateBody = mapToApiModel(req);

    try {
      const response = await patch(
        `/v1alpha1/policies/${id}`,
        updateBody,
        req.accessToken
      );

      const updatePolicyResponse = await response.json();

      const policy = mapToClientModel(updatePolicyResponse);

      return res.status(StatusCodes.OK).json(policy);
    } catch (error) {
      if (!(error instanceof RodeClientError)) {
        throw error;
      }
      const parsedResponse = JSON.parse(error.responseText);

      if (
        parsedResponse?.message?.includes("failed to compile") ||
        parsedResponse?.message?.includes("failed to parse")
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
  delete: async (req, res) => {
    const { id } = req.query;

    await del(`/v1alpha1/policies/${id}`, req.accessToken);

    return res.status(StatusCodes.NO_CONTENT).send(null);
  },
});
