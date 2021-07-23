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
import { buildPaginationParams, get } from "./utils/api-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  get: async (req, res) => {
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
      `/v1alpha1/resource-versions?${new URLSearchParams(params)}`,
      req.accessToken
    );
    const listResourceVersionsResponse = await response.json();

    const versions = listResourceVersionsResponse.versions.map((version) => ({
      versionedResourceUri: version.version,
      aliases: version.names,
      created: version.created,
    }));

    return res.status(StatusCodes.OK).json({
      data: versions,
      pageToken: listResourceVersionsResponse.nextPageToken,
    });
  },
});
