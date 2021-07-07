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
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import handler from "pages/api/policies/[id]/assignments";
import { get } from "pages/api/utils/api-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils");

describe("/api/policies/[id]/assignments", () => {
  let accessToken, request, response, assignment, rodeResponse, id;

  beforeEach(() => {
    accessToken = chance.string();
    id = chance.string();
    request = {
      accessToken,
      method: "GET",
      query: {
        id,
      },
      body: {},
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    assignment = {
      id: chance.guid(),
      policyVersionId: chance.guid(),
      policyGroup: id,
      description: chance.string(),
      created: chance.timestamp(),
    };

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        policyAssignments: [assignment],
      }),
    };

    get.mockResolvedValue(rodeResponse);
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

      get.mockResolvedValue(rodeResponse);
    });

    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(get)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `${config.get("rode.url")}/v1alpha1/policies/${id}/assignments`,
            accessToken
          );
      });

      it("should return the found assignment", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith({
            policyAssignments: [assignment],
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
});
