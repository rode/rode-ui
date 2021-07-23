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

import { apiHandler } from "utils/api-page-handler";
import { StatusCodes, ReasonPhrases, getReasonPhrase } from "http-status-codes";
import { RodeClientError } from "pages/api/utils/api-utils";

describe("apiHandler", () => {
  let handler, method, request, response;

  beforeEach(() => {
    handler = jest.fn().mockResolvedValue({});
    method = chance.word();
    request = {
      [chance.word()]: chance.word(),
      method: method,
    };
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const sendRequest = () =>
    apiHandler({ [method]: handler })(request, response);

  it("should call the handler", async () => {
    await sendRequest();

    expect(handler)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith(request, response);

    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });

  describe("the request is for an unrecognized method", () => {
    it("should return the appropriate status code", async () => {
      request.method = chance.word();
      await sendRequest();

      expect(handler).not.toHaveBeenCalled();
      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.METHOD_NOT_ALLOWED);
      expect(response.json)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
    });
  });

  describe("a RodeClientError occurs", () => {
    it("should return the same status code", async () => {
      const rodeStatusCode = chance.pickone([
        StatusCodes.FORBIDDEN,
        StatusCodes.INTERNAL_SERVER_ERROR,
        StatusCodes.PRECONDITION_FAILED,
      ]);
      const expectedStatusText = getReasonPhrase(rodeStatusCode);

      handler.mockRejectedValue(
        new RodeClientError(rodeStatusCode, chance.word())
      );

      await sendRequest();

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(rodeStatusCode);
      expect(response.json)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({ error: expectedStatusText });
    });
  });

  describe("another type of error is thrown", () => {
    it("should return an internal server error", async () => {
      handler.mockRejectedValue(new Error(chance.word()));

      await sendRequest();

      expect(response.status)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.json)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    });
  });
});
