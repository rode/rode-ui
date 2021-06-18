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
import {
  buildPaginationParams,
  get,
  getRodeUrl,
  post,
} from "./utils/api-utils";

const ALLOWED_METHODS = ["GET", "POST"];

export default async (req, res) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  if (req.method === "GET") {
    try {
      const params = buildPaginationParams(req);

      if (req.query.filter) {
        params.filter = req.query.filter;
      }

      const response = await get(
        `${rodeUrl}/v1alpha1/policy-groups?${new URLSearchParams(params)}`
      );

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      const listPolicyGroupsResponse = await response.json();

      const policyGroups = listPolicyGroupsResponse.policyGroups;

      return res.status(StatusCodes.OK).json({
        data: policyGroups,
        pageToken: listPolicyGroupsResponse.nextPageToken,
      });
    } catch (error) {
      console.error("Error listing policy groups", error);

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }

  try {
    const response = await post(`${rodeUrl}/v1alpha1/policy-groups`, req.body);

    if (!response.ok) {
      if (response.status === StatusCodes.CONFLICT) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: ReasonPhrases.CONFLICT });
      }

      console.error(`Unsuccessful response from Rode: ${response.status}`);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const createPolicyGroupResponse = await response.json();

    return res.status(StatusCodes.OK).json(createPolicyGroupResponse);
  } catch (error) {
    console.error("Error listing policy groups", error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
