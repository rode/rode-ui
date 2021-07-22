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
import handler from "pages/api/occurrences";
import {
  createMockOccurrence,
  createMockResourceUri,
} from "test/testing-utils/mocks";
import { mapOccurrencesToSections } from "pages/api/utils/occurrence-utils";
import { get } from "pages/api/utils/api-utils";

jest.mock("pages/api/utils/api-utils");

describe("/api/occurrences", () => {
  let accessToken,
    request,
    response,
    allOccurrences,
    rodeResponse,
    resourceUriParam;

  beforeEach(() => {
    resourceUriParam = createMockResourceUri();
    accessToken = chance.string();
    request = {
      accessToken,
      method: "GET",
      query: {
        resourceUri: resourceUriParam,
      },
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    allOccurrences = chance.n(
      () => createMockOccurrence(chance.pickone(["DEPLOYMENT", "BUILD"])),
      chance.d4()
    );

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        occurrences: allOccurrences,
      }),
    };

    get.mockResolvedValue(rodeResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("successful call to Rode", () => {
    it("should hit the Rode API", async () => {
      const expectedUrl = `/v1alpha1/versioned-resource-occurrences?resourceUri=${encodeURIComponent(
        resourceUriParam
      )}&fetchRelatedNotes=true&pageSize=1000`;

      await handler(request, response);

      expect(get)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedUrl, accessToken);
    });

    it("should return the mapped resources", async () => {
      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.OK);

      expect(response.json)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(
          mapOccurrencesToSections(allOccurrences, resourceUriParam)
        );
    });

    it("should return null if no resources are found for the given uri", async () => {
      rodeResponse.json.mockResolvedValue({ occurrences: [] });
      await handler(request, response);

      expect(response.send).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(null);
    });
  });
});
