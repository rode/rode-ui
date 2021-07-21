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
import { get, post } from "pages/api/utils/api-utils";
import { mapToClientModelWithPolicyDetails } from "pages/api/utils/policy-assignment-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  get: async (req, res) => {
    const { name } = req.query;

    const response = await get(
      `${rodeUrl}/v1alpha1/policy-groups/${name}/assignments`,
      req.accessToken
    );

    const getPolicyGroupAssignmentsResponse = await response.json();

    const { policyAssignments } = getPolicyGroupAssignmentsResponse;

    const promises = policyAssignments.map((assignment) =>
      mapToClientModelWithPolicyDetails(assignment, req.accessToken)
    );

    const mappedAssignments = await Promise.all(promises);

    return res.status(StatusCodes.OK).json({
      data: mappedAssignments,
    });
  },
  post: async (req, res) => {
    const { name } = req.query;
    const requestBody = req.body;

    const response = await post(
      `/v1alpha1/policies/${requestBody.policyVersionId}/assignments/${name}`,
      null,
      req.accessToken
    );

    const createdPolicyAssignmentResponse = await response.json();

    return res.status(StatusCodes.OK).json({
      data: createdPolicyAssignmentResponse,
    });
  },
});
