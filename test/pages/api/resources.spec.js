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
  let request, response, allResources, rodeResponse, filterParam;

  beforeEach(() => {
    filterParam = chance.word();
    request = {
      method: "GET",
      query: {
        filter: filterParam,
      },
    };

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
      return `${baseUrl}/v1alpha1/resources?${new URLSearchParams(query)}`;
    };

    it("should hit the Rode API", async () => {
      const expectedUrl = createExpectedUrl("http://localhost:50051", {
        filter: `"resource.uri".contains("${filterParam}")`,
      });

      await handler(request, response);

      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should hit the Rode API when no filter is specified", async () => {
      const expectedUrl = createExpectedUrl("http://localhost:50051");

      request.query.filter = null;
      await handler(request, response);

      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should take the Rode URL from the environment if set", async () => {
      const rodeUrl = chance.url();
      const expectedUrl = createExpectedUrl(rodeUrl, {
        filter: `"resource.uri".contains("${filterParam}")`,
      });
      process.env.RODE_URL = rodeUrl;

      await handler(request, response);

      delete process.env.RODE_URL;
      expect(fetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return the mapped resources", async () => {
      const expectedResources = allResources.map((resource) => ({
        name: resource.name,
        uri: resource.uri,
      }));

      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.OK);

      expect(response.json)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(expectedResources);
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
