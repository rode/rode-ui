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
import { del, patch } from "pages/api/utils/api-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  delete: async (req, res) => {
    const { assignmentId } = req.query;

    await del(`/v1alpha1/${assignmentId}`, req.accessToken);

    return res.status(StatusCodes.NO_CONTENT).send(null);
  },
  patch: async (req, res) => {
    const { name, assignmentId } = req.query;
    const requestBody = req.body;

    const response = await patch(
      `/v1alpha1/${assignmentId}`,
      {
        policyGroup: name,
        policyVersionId: requestBody.policyVersionId,
      },
      req.accessToken
    );

    const updatedPolicyAssignment = await response.json();

    return res.status(StatusCodes.OK).json({
      data: updatedPolicyAssignment,
    });
  },
});
