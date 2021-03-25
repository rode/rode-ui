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
import handler from "pages/api/policies/[id]";
import { getRodeUrl } from "pages/api/utils/api-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils");

describe("/api/policies/[id]", () => {
  let request, response, foundPolicy, rodeResponse, id, expectedRodeUrl;

  beforeEach(() => {
    expectedRodeUrl = chance.url();
    id = chance.guid();
    request = {
      method: "GET",
      query: {
        id,
      },
    };
    getRodeUrl.mockReturnValue(expectedRodeUrl);

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    foundPolicy = {
      name: chance.string(),
      description: chance.string(),
      regoContent: chance.string(),
    };

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        id,
        policy: foundPolicy,
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

  describe("GET", () => {
    beforeEach(() => {
      request.method = "GET";
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

      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(fetch)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`${expectedRodeUrl}/v1alpha1/policies/${id}`);
      });

      it("should return the found policy", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
          id,
          name: foundPolicy.name,
          description: foundPolicy.description,
          regoContent: foundPolicy.regoContent,
        });
      });

      it("should return null when the policy is not found", async () => {
        rodeResponse.status = 404;

        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);
        expect(response.send)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(null);
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

  describe("PATCH", () => {
    beforeEach(() => {
      request.method = "PATCH";
      request.body = foundPolicy;
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

      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(fetch)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`${expectedRodeUrl}/v1alpha1/policies/${id}`, {
            method: "PATCH",
            body: request.body,
          });
      });

      it("should return the updated policy", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
          id,
          name: foundPolicy.name,
          description: foundPolicy.description,
          regoContent: foundPolicy.regoContent,
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
});
