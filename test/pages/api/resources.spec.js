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
import handler from "pages/api/resources";

jest.mock("node-fetch");

describe("/api/resources", () => {
  let request,
    response,
    allResources,
    rodeResponse,
    searchTerm,
    resourceTypes,
    pageToken;

  beforeEach(() => {
    searchTerm = chance.word();
    resourceTypes = null;
    request = {
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
        genericResources: allResources,
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
      return `${baseUrl}/v1alpha1/generic-resources?${new URLSearchParams(
        query
      )}`;
    };

    it("should pass the correct params for a specified search term", async () => {
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: `name.contains("${searchTerm}")`,
      });

      await handler(request, response);

      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the correct params for specified resource types", async () => {
      resourceTypes = chance.n(chance.string, chance.d4()).join(",");
      request.query.searchTerm = null;
      request.query.resourceTypes = resourceTypes;
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: resourceTypes
          .split(",")
          .map((type) => `"type"=="${type}"`)
          .join("||"),
      });

      await handler(request, response);

      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the correct params when both search term and resource types are specified", async () => {
      resourceTypes = chance.n(chance.string, chance.d4()).join(",");
      request.query.resourceTypes = resourceTypes;
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: `name.contains("${searchTerm}")&&(${resourceTypes
          .split(",")
          .map((type) => `"type"=="${type}"`)
          .join("||")})`,
      });

      await handler(request, response);

      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should hit the Rode API when no searchTerm or resourceTypes are specified", async () => {
      const expectedUrl = createExpectedUrl("http://localhost:50051");

      request.query.searchTerm = null;
      request.query.resourceTypes = null;
      await handler(request, response);

      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the pageSize as a query param when a pageSize is specified", async () => {
      const pageSize = chance.d10();
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: `name.contains("${searchTerm}")`,
        pageSize,
      });

      request.query.pageSize = pageSize;
      await handler(request, response);
      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should pass the pageToken as a query param when a pageToken is specified", async () => {
      const pageToken = chance.string();
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: `name.contains("${searchTerm}")`,
        pageToken,
      });

      request.query.pageToken = pageToken;
      await handler(request, response);
      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
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
