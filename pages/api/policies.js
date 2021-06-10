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
import fetch from "node-fetch";
import { getRodeUrl } from "./utils/api-utils";
import { mapToApiModel, mapToClientModel } from "./utils/policy-utils";

// TODO: create fetch utils to handle stringifying and parsing bodies

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
      const searchTerm = req.query.filter;
      let filter = {};
      if (searchTerm) {
        filter = {
          filter: `policy.name.contains("${searchTerm}")`,
        };
      }
      if (req.query.pageSize) {
        filter.pageSize = req.query.pageSize;
      }
      if (req.query.pageToken) {
        filter.pageToken = req.query.pageToken;
      }
      const response = await fetch(
        `${rodeUrl}/v1alpha1/policies?${new URLSearchParams(filter)}`
      );

      if (!response.ok) {
        console.error(`Unsuccessful response from Rode: ${response.status}`);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

      const listPoliciesResponse = await response.json();
      const policies = listPoliciesResponse.policies.map((policy) =>
        mapToClientModel(policy)
      );

      res.status(StatusCodes.OK).json({
        data: policies,
        pageToken: listPoliciesResponse.nextPageToken,
      });
    } catch (error) {
      console.error("Error listing policies", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }

  if (req.method === "POST") {
    try {
      const postBody = mapToApiModel(JSON.parse(req.body));

      const response = await fetch(`${rodeUrl}/v1alpha1/policies`, {
        method: "POST",
        body: JSON.stringify(postBody),
      });

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

      const createPolicyResponse = await response.json();
      const policy = mapToClientModel(createPolicyResponse);

      res.status(StatusCodes.OK).json(policy);
    } catch (error) {
      console.error("Error creating policy", error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }
};
