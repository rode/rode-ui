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
import { getResourceDetails } from "../../utils/resource-utils";

export default async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  try {
    const genericResourceName = req.query.resource;
    const filter = {
      filter: `resource.uri.startsWith("${genericResourceName}")`,
    };

    if (req.query.pageSize) {
      filter.pageSize = req.query.pageSize;
    }
    if (req.query.pageToken) {
      filter.pageToken = req.query.pageToken;
    }
    const response = await fetch(
      `${rodeUrl}/v1alpha1/resources?${new URLSearchParams(filter)}`
    );

    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const listResourceVersionsResponse = await response.json();
    const resources = listResourceVersionsResponse.resources.map(({uri}) => {
      const {resourceVersion} = getResourceDetails(uri);
      return resourceVersion;
    });

    res.status(StatusCodes.OK).json({
      data: resources,
      pageToken: listResourceVersionsResponse.nextPageToken,
    });
  } catch (error) {
    console.error("Error listing resource versions", error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
