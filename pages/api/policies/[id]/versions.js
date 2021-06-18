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

import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { get, getRodeUrl } from "pages/api/utils/api-utils";

const ALLOWED_METHODS = ["GET"];

export default async (req, res) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  try {
    const { id } = req.query;

    const response = await get(
      `${rodeUrl}/v1alpha1/policies/${id}/versions`,
    );

    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const getPolicyVersionsResponse = await response.json();

    res.status(StatusCodes.OK).json({
      data: getPolicyVersionsResponse.versions,
      pageToken: getPolicyVersionsResponse.nextPageToken
    });
  } catch (error) {
    console.error("Error fetching policy versions", error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
