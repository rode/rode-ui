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

import fetch from "node-fetch";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import handler from "pages/api/resource-versions";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("node-fetch");
jest.mock("utils/resource-utils");

describe("/api/resource-versions", () => {
  let request,
    response,
    allResources,
    rodeResponse,
    genericResourceName,
    pageToken;

  beforeEach(() => {
    genericResourceName = chance.word();
    request = {
      method: "GET",
      query: {
        resource: genericResourceName,
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

    getResourceDetails.mockReturnValue({
      resourceVersion: chance.string(),
    });

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        resources: allResources,
        nextPageToken: pageToken,
      }),
    };

    fetch.mockResolvedValue(rodeResponse);
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
      request.query.resource = null;
      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);

      expect(response.json).toBeCalledTimes(1).toHaveBeenCalledWith({
        error: "Generic resource name must be provided",
      });
    });
  });

  describe("successful call to Rode", () => {
    let rodeUrlEnv;

    beforeEach(() => {
      rodeUrlEnv = process.env.RODE_URL;
      delete process.env.RODE_URL;
    });

    afterEach(() => {
      process.env.RODE_URL = rodeUrlEnv;
    });

    const createExpectedUrl = (baseUrl, query = {}) => {
      return `${baseUrl}/v1alpha1/resources?${new URLSearchParams(query)}`;
    };

    it("should hit the Rode API", async () => {
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: `resource.uri.startsWith("${genericResourceName}")`,
      });

      await handler(request, response);

      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the pageSize as a query param when a pageSize is specified", async () => {
      const pageSize = chance.d10();
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: `resource.uri.startsWith("${genericResourceName}")`,
        pageSize,
      });

      request.query.pageSize = pageSize;
      await handler(request, response);
      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the pageToken as a query param when a pageToken is specified", async () => {
      const pageToken = chance.string();
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: `resource.uri.startsWith("${genericResourceName}")`,
        pageToken,
      });

      request.query.pageToken = pageToken;
      await handler(request, response);
      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return the mapped resource versions", async () => {
      const version = chance.string();
      getResourceDetails.mockReturnValue({
        resourceVersion: version,
      });
      const expectedVersions = allResources.map(({ uri }) => ({
        resourceVersion: version,
        uri,
      }));

      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.OK);

      expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        data: expectedVersions,
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
      fetch.mockRejectedValue(new Error());

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