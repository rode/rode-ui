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

import config from "config";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import handler from "pages/api/policies/validate";
import { post } from "pages/api/utils/api-utils";

jest.mock("pages/api/utils/api-utils");

describe("/api/policies/validate", () => {
  let accessToken, request, response, rodeResponse, validationResult;

  beforeEach(() => {
    accessToken = chance.string();
    request = {
      accessToken,
      method: "POST",
      body: {
        [chance.string()]: chance.string(),
      },
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    validationResult = {
      errors: chance.n(chance.string, chance.d4()),
      compile: chance.bool(),
    };

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(validationResult),
    };

    post.mockResolvedValue(rodeResponse);
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

  describe("successful call to Rode", () => {
    it("should hit the Rode API", async () => {
      await handler(request, response);

      expect(post)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(
          `${config.get("rode.url")}/v1alpha1/policies:validate`,
          request.body,
          accessToken
        );
    });

    it("should return the mapped validation results", async () => {
      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.OK);

      expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        errors: validationResult.errors,
        isValid: validationResult.compile,
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
      rodeResponse.ok = false;
      rodeResponse.json.mockResolvedValue({
        details,
        message: "failed to compile the provided policy",
      });

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
      rodeResponse.ok = false;
      rodeResponse.json.mockResolvedValue({
        details,
        message: "failed to parse the provided policy",
      });

      await handler(request, response);

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
        errors: details[0].errors,
        isValid: false,
      });
    });

    it("should return a bad request status when Rego is missing rode required fields", async () => {
      const details = [
        {
          errors: chance.string(),
        },
      ];
      rodeResponse.ok = false;
      rodeResponse.json.mockResolvedValue({
        details,
        message:
          "policy compiled successfully but is missing Rode required fields",
      });

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
