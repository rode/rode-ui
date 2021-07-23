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
import {
  buildPaginationParams,
  get,
  post,
  RodeClientError,
} from "./utils/api-utils";
import { mapToApiModel, mapToClientModel } from "./utils/policy-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  get: async (req, res) => {
    const searchTerm = req.query.filter;
    let params = buildPaginationParams(req);
    if (searchTerm) {
      params.filter = `name.contains("${searchTerm}")`;
    }

    const response = await get(
      `/v1alpha1/policies?${new URLSearchParams(params)}`,
      req.accessToken
    );

    const listPoliciesResponse = await response.json();

    const policies = listPoliciesResponse.policies.map((policy) =>
      mapToClientModel(policy)
    );

    return res.status(StatusCodes.OK).json({
      data: policies,
      pageToken: listPoliciesResponse.nextPageToken,
    });
  },
  post: async (req, res) => {
    const postBody = mapToApiModel(req);

    try {
      const response = await post(
        "/v1alpha1/policies",
        postBody,
        req.accessToken
      );

      const createPolicyResponse = await response.json();
      const policy = mapToClientModel(createPolicyResponse);

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
});
