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
import { mapOccurrencesToSections } from "./utils/occurrence-utils";

export default async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  try {
    const resourceUri = req.query.resourceUri;
    const filter = `"resource.uri"=="${resourceUri}"`;
    const response = await fetch(
      `${rodeUrl}/v1alpha1/occurrences?filter=${encodeURIComponent(filter)}`
    );

    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const listOccurrencesResponse = await response.json();

    // if (listOccurrencesResponse.occurrences.length === 0) return res.status(StatusCode.OK).json(occurrences:null)
    const occurrences = mapOccurrencesToSections(
      listOccurrencesResponse.occurrences
    );

    res.status(StatusCodes.OK).json(occurrences);
  } catch (error) {
    console.error("Error listing occurrences", error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
