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
import handler from "pages/api/policies/validate";

jest.mock("node-fetch");

describe("/api/policies/validate", () => {
  let request, response, rodeResponse, validationResult;

  beforeEach(() => {
    request = {
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

    fetch.mockResolvedValue(rodeResponse);
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

      expect(fetch)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(
          "http://localhost:50052/v1alpha1/policies/validate",
          {
            body: request.body,
            method: "POST",
          }
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
