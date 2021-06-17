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
import {
  mapToApiModel,
  mapToClientModel,
} from "pages/api/utils/policy-group-utils";

const ALLOWED_METHODS = ["GET", "PATCH", "DELETE"];

// TODO: tests

export default async (req, res) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  if (req.method === "GET") {
    try {
      const { name } = req.query;

      const response = await get(`${rodeUrl}/v1alpha1/policy-groups/${name}`);

      if (response.status === StatusCodes.NOT_FOUND) {
        return res.status(StatusCodes.OK).send(null);
      }

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      const getPolicyGroupResponse = await response.json();

      res.status(StatusCodes.OK).json(mapToClientModel(getPolicyGroupResponse));
    } catch (error) {
      console.error("Error getting policy group", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { name } = req.query;

      const updateBody = mapToApiModel(req);

      const response = await patch(
        `${rodeUrl}/v1alpha1/policy-groups/${name}`,
        updateBody
      );

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      const updatePolicyGroupResponse = await response.json();

      const policy = mapToClientModel(updatePolicyGroupResponse);

      res.status(StatusCodes.OK).json(policy);
    } catch (error) {
      console.error("Error updating policy group", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { name } = req.query;

      const response = await del(`${rodeUrl}/v1alpha1/policy-groups/${name}`);

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      res.status(StatusCodes.OK).send(null);
    } catch (error) {
      console.error("Error deleting policy group", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }
};
