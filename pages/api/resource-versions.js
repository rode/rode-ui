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

import config from "config";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { buildPaginationParams, get } from "./utils/api-utils";

export default async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = config.get("rode.url");

  try {
    const resourceId = req.query.id;

    if (!resourceId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Resource id must be provided",
      });
    }

    const params = {
      id: resourceId,
      ...buildPaginationParams(req),
    };

    if (req.query.filter) {
      params.filter = req.query.filter;
    }

    const response = await get(
      `${rodeUrl}/v1alpha1/resource-versions?${new URLSearchParams(params)}`,
      req.accessToken
    );

    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const listResourceVersionsResponse = await response.json();

    const versions = listResourceVersionsResponse.versions.map((version) => ({
      versionedResourceUri: version.version,
      aliases: version.names,
      created: version.created,
    }));

    res.status(StatusCodes.OK).json({
      data: versions,
      pageToken: listResourceVersionsResponse.nextPageToken,
    });
  } catch (error) {
    console.error("Error listing resource versions", error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
