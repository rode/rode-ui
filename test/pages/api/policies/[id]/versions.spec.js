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
import handler from "pages/api/policies/[id]/versions";
import { get } from "pages/api/utils/api-utils";

jest.mock("pages/api/utils/api-utils");

describe("/api/policies/[id]/versions", () => {
  let accessToken, request, response, policyVersions, rodeResponse, id;

  beforeEach(() => {
    accessToken = chance.string();
    id = chance.guid();
    request = {
      accessToken,
      method: "GET",
      query: {
        id,
      },
    };

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    policyVersions = chance.n(() => ({
      version: chance.d4(),
      message: chance.string(),
      regoContent: chance.string(),
      created: chance.timestamp(),
    }));

    rodeResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        versions: policyVersions,
        nextPageToken: chance.guid(),
      }),
    };

    get.mockResolvedValue(rodeResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET", () => {
    describe("successful call to Rode", () => {
      it("should hit the Rode API", async () => {
        await handler(request, response);

        expect(get)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(
            `/v1alpha1/policies/${id}/versions`,
            accessToken
          );
      });

      it("should return the found policy versions", async () => {
        await handler(request, response);

        expect(response.status)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith(StatusCodes.OK);

        expect(response.json)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith({
            data: policyVersions,
            pageToken: expect.any(String),
          });
      });
    });
  });
});
