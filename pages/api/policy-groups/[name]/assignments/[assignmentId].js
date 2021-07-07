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

import config from "config";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { del, patch } from "pages/api/utils/api-utils";

const ALLOWED_METHODS = ["DELETE", "PATCH"];

export default async (req, res) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = config.get("rode.url");

  if (req.method === "DELETE") {
    try {
      const { assignmentId } = req.query;

      const response = await del(
        `${rodeUrl}/v1alpha1/${assignmentId}`,
        req.accessToken
      );

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      res.status(StatusCodes.NO_CONTENT).send(null);
    } catch (error) {
      console.error("Error deleting policy assignment", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { name, assignmentId } = req.query;
      const requestBody = req.body;

      const response = await patch(
        `${rodeUrl}/v1alpha1/${assignmentId}`,
        {
          policyGroup: name,
          policyVersionId: requestBody.policyVersionId,
        },
        req.accessToken
      );

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      const updatedPolicyAssignment = await response.json();

      return res.status(StatusCodes.OK).json({
        data: updatedPolicyAssignment,
      });
    } catch (error) {
      console.error("Error updating policy assignment", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }
};
