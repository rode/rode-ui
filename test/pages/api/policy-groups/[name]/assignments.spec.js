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
import handler from "pages/api/policy-groups/[name]/assignments";
import { get, post } from "pages/api/utils/api-utils";
import { mapToClientModelWithPolicyDetails } from "pages/api/utils/policy-assignment-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils");
jest.mock("pages/api/utils/policy-assignment-utils");

describe("/api/policy-groups/[name]/assignments", () => {
  let accessToken, request, response, assignment, rodeResponse, name;

  beforeEach(() => {
    accessToken = chance.string();
    name = chance.string();
    request = {
      accessToken,
      method: "GET",
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
            `/v1alpha1/policy-groups/${name}/assignments`,
            accessToken
          );
      });

      it("should return the found, mapped assignment", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith({
            data: [assignment],
          });
      });
    });
  });

  describe("POST", () => {
    beforeEach(() => {
      request.method = "POST";
      request.body = assignment;
      request.headers = {
        "Content-Type": "application/json",
      };
      post.mockResolvedValue(rodeResponse);
      rodeResponse.json.mockResolvedValue(assignment);
    });

    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(post)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `/v1alpha1/policies/${assignment.policyVersionId}/assignments/${name}`,
            null,
            accessToken
          );
      });

      it("should return the created policy group assignment", async () => {
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
