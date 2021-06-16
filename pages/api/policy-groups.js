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
import { get, getRodeUrl, post } from "./utils/api-utils";

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
      const params = {};

      if (req.query.filter) {
        params.filter = req.query.filter;
      }
      if (req.query.pageSize) {
        params.pageSize = req.query.pageSize;
      }
      if (req.query.pageToken) {
        params.pageToken = req.query.pageToken;
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

      res.status(StatusCodes.OK).json({
        data: policyGroups,
        pageToken: listPolicyGroupsResponse.nextPageToken,
      });
    } catch (error) {
      console.error("Error listing policy groups", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }
  if (req.method === "POST") {
    try {
      const requestBody = req.body;
      const response = await post(
        `${rodeUrl}/v1alpha1/policy-groups`,
        requestBody
      );

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      const createPolicyGroupResponse = await response.json();

      const policyGroup = createPolicyGroupResponse;

      res.status(StatusCodes.OK).json({
        data: policyGroup,
        pageToken: createPolicyGroupResponse.nextPageToken,
      });
    } catch (error) {
      console.error("Error listing policy groups", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }
};
