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
import { apiHandler } from "utils/api-page-handler";
import { get } from "./utils/api-utils";
import { mapOccurrencesToSections } from "./utils/occurrence-utils";

export default apiHandler({
  get: async (req, res) => {
    const resourceUri = req.query.resourceUri;
    const response = await get(
      `/v1alpha1/versioned-resource-occurrences?resourceUri=${encodeURIComponent(
        resourceUri
      )}&fetchRelatedNotes=true&pageSize=1000`,
      req.accessToken
    );

    const listOccurrencesResponse = await response.json();

    if (!listOccurrencesResponse.occurrences?.length) {
      return res.status(StatusCodes.OK).send(null);
    }

    const occurrences = mapOccurrencesToSections(
      listOccurrencesResponse.occurrences,
      resourceUri,
      listOccurrencesResponse.relatedNotes
    );

    return res.status(StatusCodes.OK).json(occurrences);
  },
});
