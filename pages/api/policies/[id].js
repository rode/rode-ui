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

import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { del, get, getRodeUrl, patch } from "pages/api/utils/api-utils";
import { mapToApiModel, mapToClientModel } from "pages/api/utils/policy-utils";

const ALLOWED_METHODS = ["GET", "PATCH", "DELETE"];

export default async (req, res) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  if (req.method === "GET") {
    try {
      const { id } = req.query;

      const response = await get(`${rodeUrl}/v1alpha1/policies/${id}`);

      if (response.status === StatusCodes.NOT_FOUND) {
        return res.status(StatusCodes.OK).send(null);
      }

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      const getPolicyResponse = await response.json();

      const policy = mapToClientModel(getPolicyResponse);

      res.status(StatusCodes.OK).json(policy);
    } catch (error) {
      console.error("Error getting policy", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { id } = req.query;

      const updateBody = mapToApiModel(req.body);

      const response = await patch(
        `${rodeUrl}/v1alpha1/policies/${id}`,
        updateBody
      );

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);

        const parsedResponse = await response.json();

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

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      const updatePolicyResponse = await response.json();

      const policy = mapToClientModel(updatePolicyResponse);

      res.status(StatusCodes.OK).json(policy);
    } catch (error) {
      console.error("Error updating policy", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      const response = await del(`${rodeUrl}/v1alpha1/policies/${id}`);

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      res.status(StatusCodes.OK).send(null);
    } catch (error) {
      console.error("Error deleting policy", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }
};
