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
import { buildPaginationParams, get } from "pages/api/utils/api-utils";
import { mapToClientModelWithPolicyDetails } from "pages/api/utils/resource-evaluation-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  get: async (req, res) => {
    const { resourceUri } = req.query;

    const params = {
      ...buildPaginationParams(req),
      resourceUri,
    };

    const response = await get(
      `/v1alpha1/resource-evaluations?${new URLSearchParams(params)}`,
      req.accessToken
    );

    const listResourceEvaluationsResponse = await response.json();

    const {
      resourceEvaluations,
      nextPageToken,
    } = listResourceEvaluationsResponse;

    const promises = resourceEvaluations.map((evaluation) =>
      mapToClientModelWithPolicyDetails(evaluation, req.accessToken)
    );

    const mappedEvaluations = await Promise.all(promises);

    return res.status(StatusCodes.OK).json({
      data: mappedEvaluations,
      pageToken: nextPageToken,
    });
  },
});
