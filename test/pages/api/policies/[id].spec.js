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
import handler from "pages/api/policies/[id]";
import { get, patch, del } from "pages/api/utils/api-utils";
import { mapToApiModel } from "pages/api/utils/policy-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils", () => ({
  ...jest.requireActual("pages/api/utils/api-utils"),
  get: jest.fn(),
  patch: jest.fn(),
  del: jest.fn(),
}));

const { RodeClientError } = jest.requireActual("pages/api/utils/api-utils");

describe("/api/policies/[id]", () => {
  let accessToken, request, response, foundPolicy, rodeResponse, id;

  beforeEach(() => {
    accessToken = chance.string();
    id = chance.guid();
    request = {
      accessToken,
      method: "GET",
      query: {
        id,
      },
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    foundPolicy = {
      id,
      name: chance.string(),
      description: chance.string(),
      policy: {
        version: chance.d4(),
        message: chance.string(),
        regoContent: chance.string(),
      },
    };

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        id,
        ...foundPolicy,
      }),
    };

    get.mockResolvedValue(rodeResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET", () => {
    beforeEach(() => {
      request.method = "GET";

      get.mockResolvedValue(rodeResponse);
    });

    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(get)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`/v1alpha1/policies/${id}`, accessToken);
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
          regoContent: foundPolicy.policy.regoContent,
          currentVersion: foundPolicy.currentVersion,
          policyVersionId: foundPolicy.policy.id,
          policyVersion: foundPolicy.policy.version,
        });
      });
    });

    describe("call to Rode returns a non-200 status code", () => {
      describe("the policy is not found", () => {
        it("should return null", async () => {
          get.mockRejectedValue(
            new RodeClientError(StatusCodes.NOT_FOUND, "{}")
          );

          await handler(request, response);

          expect(response.status)
            .toHaveBeenCalledTimes(1)
            .toHaveBeenCalledWith(StatusCodes.OK);
          expect(response.send)
            .toHaveBeenCalledTimes(1)
            .toHaveBeenCalledWith(null);
        });
      });

      describe("another status code is returned", () => {
        it("should return that status", async () => {
          const statusCode = chance.pickone([
            StatusCodes.INTERNAL_SERVER_ERROR,
            StatusCodes.FORBIDDEN,
            StatusCodes.BAD_GATEWAY,
          ]);
          get.mockRejectedValue(new RodeClientError(statusCode, "{}"));

          await handler(request, response);

          expect(response.status)
            .toHaveBeenCalledTimes(1)
            .toHaveBeenCalledWith(statusCode);
        });
      });
    });
  });

  describe("PATCH", () => {
    beforeEach(() => {
      request.method = "PATCH";
      request.body = JSON.stringify(foundPolicy);
      request.headers = {
        "Content-Type": "application/json",
      };
      patch.mockResolvedValue(rodeResponse);
    });

    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(patch)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `/v1alpha1/policies/${id}`,
            mapToApiModel(request),
            accessToken
          );
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
          regoContent: foundPolicy.policy.regoContent,
          currentVersion: foundPolicy.currentVersion,
          policyVersionId: foundPolicy.policy.id,
          policyVersion: foundPolicy.policy.version,
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
            message: "failed to parse the provided policy",
          })
        );

        patch.mockRejectedValue(clientError);

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

        patch.mockRejectedValue(clientError);

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
        patch.mockRejectedValue(
          new RodeClientError(StatusCodes.INTERNAL_SERVER_ERROR, "{}")
        );

        await handler(request, response);

        assertInternalServerError();
      });

      it("should return an internal server error on a network or other fetch error", async () => {
        patch.mockRejectedValue(new Error());

        await handler(request, response);

        assertInternalServerError();
      });

      it("should return an internal server error when JSON is invalid", async () => {
        patch.mockRejectedValue(
          new RodeClientError(StatusCodes.INTERNAL_SERVER_ERROR, "}")
        );

        await handler(request, response);

        assertInternalServerError();
      });
    });
  });

  describe("DELETE", () => {
    beforeEach(() => {
      request.method = "DELETE";
    });

    describe("successful call to Rode", () => {
      beforeEach(() => {
        del.mockResolvedValue(rodeResponse);
      });

      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(del)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(`/v1alpha1/policies/${id}`, accessToken);
      });

      it("should return null if the delete was successful", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.NO_CONTENT);

        expect(response.send)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(null);
      });
    });
  });
});
