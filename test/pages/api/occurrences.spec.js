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

  describe("unimplemented method", () => {
    it("should return method not allowed", async () => {
      request.method = chance.word();

      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.METHOD_NOT_ALLOWED);

      expect(response.json)
        .toBeCalledTimes(1)
        .toHaveBeenCalledWith({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
    });
  });

  describe("successful call to Rode", () => {
    it("should hit the Rode API", async () => {
      const expectedUrl = `${config.get(
        "rode.url"
      )}/v1alpha1/versioned-resource-occurrences?resourceUri=${encodeURIComponent(
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

  describe("call to Rode fails", () => {
    const assertInternalServerError = () => {
      expect(response.status)
        .toBeCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(response.json)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    };

    it("should return an internal server error on a non-200 response from Rode", async () => {
      rodeResponse.ok = false;

      await handler(request, response);

      assertInternalServerError();
    });

    it("should return an internal server error on a network or other fetch error", async () => {
      get.mockRejectedValue(new Error());

      await handler(request, response);

      assertInternalServerError();
    });

    it("should return an internal server error when JSON is invalid", async () => {
      rodeResponse.json.mockRejectedValue(new Error());

      await handler(request, response);

      assertInternalServerError();
    });
  });
});
