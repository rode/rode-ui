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
import handler from "pages/api/policy-groups/[name]/assignments/[assignmentId]";
import { del, get, patch } from "pages/api/utils/api-utils";
import { mapToClientModelWithPolicyDetails } from "pages/api/utils/policy-assignment-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils");
jest.mock("pages/api/utils/policy-assignment-utils");

describe("/api/policy-groups/[name]/assignments/[assignmentId]", () => {
  let accessToken, request, response, assignment, rodeResponse, name;

  beforeEach(() => {
    accessToken = chance.string();
    name = chance.string();
    request = {
      accessToken,
      method: "DELETE",
      query: {
        name,
      },
      body: {},
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    assignment = {
      id: chance.guid(),
      policyVersionId: chance.guid(),
      policyGroup: name,
      description: chance.string(),
      created: chance.timestamp(),
    };

    mapToClientModelWithPolicyDetails.mockResolvedValue(assignment);

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        policyAssignments: [assignment],
        nextPageToken: chance.string(),
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

  describe("DELETE", () => {
    beforeEach(() => {
      request.method = "DELETE";
      request.query = {
        assignmentId: assignment.id,
      };
    });

    describe("successful call to Rode", () => {
      beforeEach(() => {
        del.mockResolvedValue(rodeResponse);
      });

      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(del)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `${config.get("rode.url")}/v1alpha1/${assignment.id}`,
            accessToken
          );
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
        del.mockResolvedValue(rodeResponse);

        await handler(request, response);

        assertInternalServerError();
      });

      it("should return an internal server error on a network or other fetch error", async () => {
        del.mockRejectedValue(new Error());

        await handler(request, response);

        assertInternalServerError();
      });
    });
  });

  describe("PATCH", () => {
    beforeEach(() => {
      request.method = "PATCH";
      request.body = assignment;
      request.headers = {
        "Content-Type": "application/json",
      };
      request.query = {
        assignmentId: assignment.id,
        name,
      };
      patch.mockResolvedValue(rodeResponse);
      rodeResponse.json.mockResolvedValue(assignment);
    });

    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(patch)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `${config.get("rode.url")}/v1alpha1/${assignment.id}`,
            {
              policyGroup: name,
              policyVersionId: assignment.policyVersionId,
            },
            accessToken
          );
      });

      it("should return the updated policy group assignment", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith({ data: assignment });
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
        patch.mockRejectedValue(new Error());

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
