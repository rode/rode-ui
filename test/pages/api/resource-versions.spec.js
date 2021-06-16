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
import handler from "pages/api/resource-versions";
import { getRodeUrl, get } from "pages/api/utils/api-utils";

jest.mock("pages/api/utils/api-utils");

describe("/api/resource-versions", () => {
  let request,
    response,
    resourceVersions,
    rodeResponse,
    resourceId,
    pageToken,
    rodeUrl;

  beforeEach(() => {
    resourceId = chance.word();
    request = {
      method: "GET",
      query: {
        id: resourceId,
      },
    };
    pageToken = chance.string();

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    resourceVersions = chance.n(
      () => ({
        version: chance.name(),
        names: chance.n(chance.string, chance.d4()),
        created: chance.timestamp(),
      }),
      chance.d4()
    );

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        versions: resourceVersions,
        nextPageToken: pageToken,
      }),
    };
    rodeUrl = chance.url();

    getRodeUrl.mockReturnValue(rodeUrl);

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

  describe("missing resource name", () => {
    it("should return bad request when the resource name is not provided", async () => {
      request.query.id = null;
      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);

      expect(response.json).toBeCalledTimes(1).toHaveBeenCalledWith({
        error: "Resource id must be provided",
      });
    });
  });

  describe("successful call to Rode", () => {
    const createExpectedUrl = (query = {}) => {
      return `${rodeUrl}/v1alpha1/resource-versions?${new URLSearchParams(
        query
      )}`;
    };

    it("should hit the Rode API", async () => {
      const expectedUrl = createExpectedUrl({
        id: resourceId,
      });

      await handler(request, response);

      expect(get).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the filter as a query param when a filter is specified", async () => {
      const filter = chance.string();
      const expectedUrl = createExpectedUrl({
        id: resourceId,
        filter,
      });

      request.query.filter = filter;
      await handler(request, response);
      expect(get).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the pageSize as a query param when a pageSize is specified", async () => {
      const pageSize = chance.d10();
      const expectedUrl = createExpectedUrl({
        id: resourceId,
        pageSize,
      });

      request.query.pageSize = pageSize;
      await handler(request, response);
      expect(get).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the pageToken as a query param when a pageToken is specified", async () => {
      const pageToken = chance.string();
      const expectedUrl = createExpectedUrl({
        id: resourceId,
        pageToken,
      });

      request.query.pageToken = pageToken;
      await handler(request, response);
      expect(get).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return the resource versions", async () => {
      const mappedVersions = resourceVersions.map((version) => ({
        versionedResourceUri: version.version,
        aliases: version.names,
        created: version.created,
      }));
      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.OK);

      expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        data: mappedVersions,
        pageToken,
      });
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
