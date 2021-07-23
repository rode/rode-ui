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
import handler from "pages/api/resources";
import { get, buildPaginationParams } from "pages/api/utils/api-utils";

jest.mock("pages/api/utils/api-utils");

describe("/api/resources", () => {
  let accessToken,
    request,
    response,
    allResources,
    rodeResponse,
    searchTerm,
    resourceTypes,
    pageToken;

  beforeEach(() => {
    searchTerm = chance.word();
    resourceTypes = null;
    accessToken = chance.string();
    request = {
      accessToken,
      method: "GET",
      query: {
        searchTerm,
        resourceTypes,
      },
    };
    pageToken = chance.string();

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    allResources = chance.n(
      () => ({
        [chance.word()]: chance.word(),
        name: chance.name(),
        uri: chance.url(),
      }),
      chance.d4()
    );

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        resources: allResources,
        nextPageToken: pageToken,
      }),
    };

    buildPaginationParams.mockReturnValue({});

    get.mockResolvedValue(rodeResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("successful call to Rode", () => {
    const createExpectedUrl = (query = {}) => {
      return `/v1alpha1/resources?${new URLSearchParams(query)}`;
    };

    it("should pass the correct params for a specified search term", async () => {
      const expectedUrl = createExpectedUrl({
        filter: `name.contains("${searchTerm}")`,
      });

      await handler(request, response);

      expect(buildPaginationParams)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(request);
      expect(get)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedUrl, accessToken);
    });

    it("should pass the correct params for specified resource types", async () => {
      resourceTypes = chance.n(chance.string, chance.d4()).join(",");
      request.query.searchTerm = null;
      request.query.resourceTypes = resourceTypes;
      const expectedUrl = createExpectedUrl({
        filter: resourceTypes
          .split(",")
          .map((type) => `type=="${type}"`)
          .join("||"),
      });

      await handler(request, response);

      expect(buildPaginationParams)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(request);
      expect(get)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedUrl, accessToken);
    });

    it("should pass the correct params when both search term and resource types are specified", async () => {
      resourceTypes = chance.n(chance.string, chance.d4()).join(",");
      request.query.resourceTypes = resourceTypes;
      const expectedUrl = createExpectedUrl({
        filter: `name.contains("${searchTerm}")&&(${resourceTypes
          .split(",")
          .map((type) => `type=="${type}"`)
          .join("||")})`,
      });

      await handler(request, response);

      expect(buildPaginationParams)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(request);
      expect(get)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedUrl, accessToken);
    });

    it("should hit the Rode API when no searchTerm or resourceTypes are specified", async () => {
      const expectedUrl = createExpectedUrl();

      request.query.searchTerm = null;
      request.query.resourceTypes = null;
      await handler(request, response);

      expect(buildPaginationParams)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(request);
      expect(get)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedUrl, accessToken);
    });

    it("should return the mapped resources", async () => {
      const expectedResources = allResources;

      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.OK);

      expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        data: expectedResources,
        pageToken,
      });
    });
  });
});
