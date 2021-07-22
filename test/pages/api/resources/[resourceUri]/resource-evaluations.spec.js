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
import handler from "pages/api/resources/[resourceUri]/resource-evaluations";
import { get } from "pages/api/utils/api-utils";
import { mapToClientModelWithPolicyDetails } from "pages/api/utils/resource-evaluation-utils";

jest.mock("node-fetch");
jest.mock("pages/api/utils/api-utils");
jest.mock("pages/api/utils/resource-evaluation-utils");

describe("/api/resources/[resourceUri]/resource-evaluations", () => {
  let accessToken,
    request,
    response,
    evaluation,
    rodeResponse,
    resourceUri,
    parsedJson;

  beforeEach(() => {
    accessToken = chance.string();
    resourceUri = chance.string();
    request = {
      accessToken,
      method: "GET",
      query: {
        resourceUri,
      },
      body: {},
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    evaluation = {
      [chance.string()]: chance.string(),
    };

    mapToClientModelWithPolicyDetails.mockResolvedValue(evaluation);

    parsedJson = {
      resourceEvaluations: [evaluation],
      nextPageToken: chance.string(),
    };

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(parsedJson),
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
            `/v1alpha1/resource-evaluations?${new URLSearchParams({
              resourceUri,
            })}`,
            accessToken
          );
      });

      it("should return the found, mapped evaluation", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith({
            data: [evaluation],
            pageToken: parsedJson.nextPageToken,
          });
      });
    });
  });
});
