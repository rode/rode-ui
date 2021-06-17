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
import handler from "pages/api/policy-groups";
import {
  get,
  post,
  getRodeUrl,
  buildPaginationParams,
} from "pages/api/utils/api-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils");

describe("/api/policy-groups", () => {
  let request, response, rodeResponse;

  beforeEach(() => {
    request = {
      method: chance.pickone(["GET", "POST"]),
      query: {},
      body: {},
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    buildPaginationParams.mockReturnValue({});

    getRodeUrl.mockReturnValue("http://localhost:50051");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const assertInternalServerError = () => {
    expect(response.status)
      .toBeCalledTimes(1)
      .toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.json)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  };

  describe("unimplemented methods", () => {
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
    let policyGroups, pageToken;

    beforeEach(() => {
      request = {
        method: "GET",
        query: {},
      };
      pageToken = chance.string();

      policyGroups = chance.n(
        () => ({
          [chance.word()]: chance.word(),
          name: chance.name(),
          description: chance.sentence(),
        }),
        chance.d4()
      );

      rodeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          policyGroups: policyGroups,
          nextPageToken: pageToken,
        }),
      };

      get.mockResolvedValue(rodeResponse);
    });

    describe("successful call to Rode", () => {
      const createExpectedUrl = (baseUrl, query = {}) => {
        return `${baseUrl}/v1alpha1/policy-groups?${new URLSearchParams(
          query
        )}`;
      };

      it("should hit the Rode API", async () => {
        const expectedUrl = createExpectedUrl("http://localhost:50051");

        await handler(request, response);

        expect(buildPaginationParams)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(request);
        expect(get).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
      });

      it("should pass the filter as a query param when a filter is specified", async () => {
        const filter = chance.string();
        const expectedUrl = createExpectedUrl("http://localhost:50051", {
          filter,
        });

        request.query.filter = filter;
        await handler(request, response);
        expect(buildPaginationParams)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(request);
        expect(get).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(expectedUrl);
      });

      it("should return the policy groups", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
          data: policyGroups,
          pageToken,
        });
      });
    });

    describe("failed calls to Rode", () => {
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

  describe("POST", () => {
    let formData, createdPolicyGroup;

    beforeEach(() => {
      formData = {
        [chance.string()]: chance.string(),
      };
      request = {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      };

      createdPolicyGroup = {
        name: chance.string(),
        description: chance.sentence(),
      };

      rodeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(createdPolicyGroup),
      };

      post.mockResolvedValue(rodeResponse);
    });

    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(post)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            "http://localhost:50051/v1alpha1/policy-groups",
            request.body
          );
      });

      it("should return the created policy group", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(createdPolicyGroup);
      });
    });

    describe("failed calls to Rode", () => {
      it("should return an internal server error on a non-200 response from Rode", async () => {
        rodeResponse.ok = false;

        await handler(request, response);

        assertInternalServerError();
      });

      it("should return an internal server error on a network or other fetch error", async () => {
        post.mockRejectedValue(new Error());

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
