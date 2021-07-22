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
import handler from "pages/api/policies/[id]/attest";
import { post } from "pages/api/utils/api-utils";

jest.mock("pages/api/utils/api-utils");

describe("/api/policies/[id]/attest", () => {
  let accessToken, request, response, evalResponse, rodeResponse, id;

  beforeEach(() => {
    accessToken = chance.string();
    id = chance.guid();
    request = {
      accessToken,
      method: "POST",
      query: {
        id,
      },
      body: {
        [chance.string()]: chance.string(),
      },
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    evalResponse = {
      pass: chance.bool(),
      result: chance.string(),
      explanation: chance.string(),
    };

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(evalResponse),
    };

    post.mockResolvedValue(rodeResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("POST", () => {
    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(post)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `/v1alpha1/policies/${id}:attest`,
            request.body,
            accessToken
          );
      });

      it("should return the policy evaluation", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(evalResponse);
      });
    });
  });
});
