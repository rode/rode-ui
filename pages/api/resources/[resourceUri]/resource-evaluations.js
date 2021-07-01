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
import { buildPaginationParams, get, getRodeUrl } from "pages/api/utils/api-utils";
import { mapToClientModelWithPolicyDetails } from "pages/api/utils/resource-evaluation-utils";

// TODO: tests
export default async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  try {
    const { resourceUri } = req.query;

    const params = {
      ...buildPaginationParams(req),
      resourceUri
    };

    if (req.query.filter) {
      params.filter = req.query.filter;
    }

    const response = await get(
      `${rodeUrl}/v1alpha1/resource-evaluations?${new URLSearchParams(params)}`
    );

    console.log('response', response);

    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const listResourceEvaluationsResponse = await response.json();

    const {resourceEvaluations, nextPageToken} = listResourceEvaluationsResponse;

    const promises = resourceEvaluations.map(mapToClientModelWithPolicyDetails);

    const mappedEvaluations = await Promise.all(promises);

    res.status(StatusCodes.OK).json({
      data: mappedEvaluations,
      pageToken: nextPageToken,
    });
  } catch (error) {
    console.error("Error listing resource evaluations", error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
