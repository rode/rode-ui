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
    const searchTerm = req.query.searchTerm;
    const resourceTypes = req.query.resourceTypes;

    let params = buildPaginationParams(req);

    if (searchTerm && resourceTypes) {
      const resources = resourceTypes.split(",");
      params.filter = `name.contains("${searchTerm}")&&(${resources
        .map((type) => `type=="${type}"`)
        .join("||")})`;
    } else if (searchTerm) {
      params.filter = `name.contains("${searchTerm}")`;
    } else if (resourceTypes) {
      const resources = resourceTypes.split(",");
      params.filter = `${resources
        .map((type) => `type=="${type}"`)
        .join("||")}`;
    }

    const response = await get(
      `/v1alpha1/resources?${new URLSearchParams(params)}`,
      req.accessToken
    );

    const listResourcesResponse = await response.json();
    const resources = listResourcesResponse.resources;

    return res.status(StatusCodes.OK).json({
      data: resources,
      pageToken: listResourcesResponse.nextPageToken,
    });
  },
});
