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
import handler from "pages/api/policies";
import {
  get,
  post,
  buildPaginationParams,
  RodeClientError,
} from "pages/api/utils/api-utils";
import { mapToApiModel } from "pages/api/utils/policy-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils");
jest.mock("pages/api/utils/api-utils", () => ({
  ...jest.requireActual("pages/api/utils/api-utils"),
  post: jest.fn(),
  get: jest.fn(),
  buildPaginationParams: jest.fn(),
}));

describe("/api/policies", () => {
  let accessToken, request, response, rodeResponse;

  beforeEach(() => {
    accessToken = chance.string();
    request = {
      accessToken,
      method: chance.pickone(["GET", "POST"]),
      query: {},
      body: {},
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
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

  describe("GET", () => {
    let filterParam, allPolicies, pageToken;

    beforeEach(() => {
      filterParam = chance.word();
      request = {
        accessToken,
        method: "GET",
        query: {
          filter: filterParam,
        },
      };
      pageToken = chance.string();

      allPolicies = chance.n(
        () => ({
          [chance.word()]: chance.word(),
          id: chance.guid(),
          name: chance.name(),
          description: chance.sentence(),
          policy: {
            regoContent: chance.string(),
          },
        }),
        chance.d4()
      );
      buildPaginationParams.mockReturnValue({});

      rodeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          policies: allPolicies,
          nextPageToken: pageToken,
        }),
      };

      get.mockResolvedValue(rodeResponse);
    });

    describe("successful call to Rode", () => {
      const createExpectedUrl = (query = {}) => {
        return `/v1alpha1/policies?${new URLSearchParams(query)}`;
      };

      it("should hit the Rode API", async () => {
        const expectedUrl = createExpectedUrl({
          filter: `name.contains("${filterParam}")`,
        });

        await handler(request, response);

        expect(buildPaginationParams).toHaveBeenCalledWith(request);
        expect(get)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(expectedUrl, accessToken);
      });

      it("should hit the Rode API when no filter is specified", async () => {
        const expectedUrl = createExpectedUrl();

        request.query.filter = null;
        await handler(request, response);

        expect(buildPaginationParams).toHaveBeenCalledWith(request);
        expect(get)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(expectedUrl, accessToken);
      });

      it("should return the mapped policies", async () => {
        const expectedPolicies = allPolicies.map(
          ({ id, name, description, policy }) => ({
            id,
            name: name,
            description: description,
            regoContent: policy.regoContent,
          })
        );

        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
          data: expectedPolicies,
          pageToken,
        });
      });
    });
  });

  describe("POST", () => {
    let formData, createdPolicy;

    beforeEach(() => {
      formData = {
        [chance.string()]: chance.string(),
      };
      request = {
        accessToken,
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      };

      createdPolicy = {
        id: chance.guid(),
        name: chance.string(),
        description: chance.sentence(),
        policy: {
          regoContent: chance.string(),
        },
      };

      rodeResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(createdPolicy),
      };

      post.mockResolvedValue(rodeResponse);
    });

    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(post)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            "/v1alpha1/policies",
            mapToApiModel(request),
            accessToken
          );
      });

      it("should return the mapped created policy", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
          id: createdPolicy.id,
          name: createdPolicy.name,
          description: createdPolicy.description,
          regoContent: createdPolicy.policy.regoContent,
        });
      });
    });

    describe("failed calls to Rode", () => {
      it("should return a bad request status when Rego fails to compile", async () => {
        const details = [
          {
            errors: chance.string(),
          },
        ];

        const clientError = new RodeClientError(
          StatusCodes.BAD_REQUEST,
          JSON.stringify({
            details,
            message: "failed to compile the provided policy",
          })
        );
        post.mockRejectedValue(clientError);

        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
          errors: details[0].errors,
          isValid: false,
        });
      });

      it("should return a bad request status when Rego fails to parse", async () => {
        const details = [
          {
            errors: chance.string(),
          },
        ];
        const clientError = new RodeClientError(
          StatusCodes.BAD_REQUEST,
          JSON.stringify({
            details,
            message: "failed to parse the provided policy",
          })
        );
        post.mockRejectedValue(clientError);

        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
          errors: details[0].errors,
          isValid: false,
        });
      });

      it("should return an internal server error on a non-200 response from Rode", async () => {
        post.mockRejectedValue(
          new RodeClientError(StatusCodes.INTERNAL_SERVER_ERROR, "{}")
        );

        await handler(request, response);

        assertInternalServerError();
      });

      it("should return an internal server error on a network or other fetch error", async () => {
        post.mockRejectedValue(new Error());

        await handler(request, response);

        assertInternalServerError();
      });

      it("should return an internal server error when JSON is invalid", async () => {
        post.mockRejectedValue(
          new RodeClientError(StatusCodes.INTERNAL_SERVER_ERROR, "}")
        );

        await handler(request, response);

        assertInternalServerError();
      });
    });
  });
});
