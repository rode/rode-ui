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
import handler from "pages/api/resource-versions";
import { get, buildPaginationParams } from "pages/api/utils/api-utils";

jest.mock("pages/api/utils/api-utils");

describe("/api/resource-versions", () => {
  let accessToken,
    request,
    response,
    resourceVersions,
    rodeResponse,
    resourceId,
    pageToken;

  beforeEach(() => {
    resourceId = chance.word();
    accessToken = chance.string();
    request = {
      accessToken,
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
    buildPaginationParams.mockReturnValue({});

    get.mockResolvedValue(rodeResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
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
      return `/v1alpha1/resource-versions?${new URLSearchParams(query)}`;
    };

    it("should hit the Rode API", async () => {
      const expectedUrl = createExpectedUrl({
        id: resourceId,
      });

      await handler(request, response);

      expect(buildPaginationParams)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(request);
      expect(get)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedUrl, accessToken);
    });

    it("should pass the filter as a query param when a filter is specified", async () => {
      const filter = chance.string();
      const expectedUrl = createExpectedUrl({
        id: resourceId,
        filter,
      });

      request.query.filter = filter;
      await handler(request, response);

      expect(buildPaginationParams)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(request);
      expect(get)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedUrl, accessToken);
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
});
