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

import { apiHandler } from "utils/api-page-handler";
import { StatusCodes } from "http-status-codes";
import { get } from "pages/api/utils/api-utils";

export default apiHandler({
  get: async (req, res) => {
    const { id } = req.query;

    const response = await get(
      `/v1alpha1/policies/${id}/assignments`,
      req.accessToken
    );

    const getPolicyAssignments = await response.json();

    const { policyAssignments } = getPolicyAssignments;

    return res.status(StatusCodes.OK).json({
      policyAssignments,
    });
  },
});
