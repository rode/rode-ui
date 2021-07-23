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
import handler from "pages/api/policy-groups";
import { get, post, buildPaginationParams } from "pages/api/utils/api-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils");

describe("/api/policy-groups", () => {
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

    buildPaginationParams.mockReturnValue({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET", () => {
    let policyGroups, pageToken;

    beforeEach(() => {
      request = {
        accessToken,
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
      const createExpectedUrl = (query = {}) => {
        return `/v1alpha1/policy-groups?${new URLSearchParams(query)}`;
      };

      it("should hit the Rode API", async () => {
        const expectedUrl = createExpectedUrl();

        await handler(request, response);

        expect(buildPaginationParams)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(request);
        expect(get)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(expectedUrl, accessToken);
      });

      it("should pass the filter as a query param when a filter is specified", async () => {
        const filter = chance.string();
        const expectedUrl = createExpectedUrl({
          filter,
        });

        request.query.filter = filter;
        await handler(request, response);
        expect(buildPaginationParams)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(request);
        expect(get)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(expectedUrl, accessToken);
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
  });

  describe("POST", () => {
    let formData, createdPolicyGroup;

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
            "/v1alpha1/policy-groups",
            request.body,
            accessToken
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
  });
});
