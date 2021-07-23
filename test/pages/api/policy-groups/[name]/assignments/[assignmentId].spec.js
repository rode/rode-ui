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

import { StatusCodes } from "http-status-codes";
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
          .toHaveBeenCalledWith(`/v1alpha1/${assignment.id}`, accessToken);
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

        expect(patch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(
          `/v1alpha1/${assignment.id}`,
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
  });
});
