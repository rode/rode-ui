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

import {
  getPolicyByPolicyId,
  mapToApiModel,
  mapToClientModel,
} from "pages/api/utils/policy-utils";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { get, RodeClientError } from "pages/api/utils/api-utils";

jest.mock("pages/api/utils/api-utils", () => ({
  ...jest.requireActual("pages/api/utils/api-utils"),
  get: jest.fn(),
}));

describe("policy-utils", () => {
  describe("mapToClientModel", () => {
    let unmappedPolicy;
    beforeEach(() => {
      unmappedPolicy = {
        [chance.string()]: chance.string(),
        id: chance.string(),
        name: chance.string(),
        description: chance.string(),
        policy: {
          [chance.string()]: chance.string(),
          regoContent: chance.string(),
          id: chance.guid(),
          version: chance.d4(),
        },
      };
    });

    it("should return the mapped policy matching the client model", () => {
      const actual = mapToClientModel(unmappedPolicy);

      expect(actual).toEqual({
        id: unmappedPolicy.id,
        name: unmappedPolicy.name,
        description: unmappedPolicy.description,
        regoContent: unmappedPolicy.policy.regoContent,
        currentVersion: unmappedPolicy.currentVersion,
        policyVersionId: unmappedPolicy.policy.id,
        policyVersion: unmappedPolicy.policy.version,
      });
    });
  });

  describe("mapToApiModel", () => {
    let unmappedPolicy, request;

    beforeEach(() => {
      unmappedPolicy = {
        [chance.string()]: chance.string(),
        name: chance.string(),
        description: chance.string(),
        regoContent: chance.string(),
        message: chance.string(),
      };

      request = {
        body: unmappedPolicy,
      };
    });

    it("should return the mapped policy matching the api model", () => {
      const actual = mapToApiModel(request);

      expect(actual).toEqual({
        name: unmappedPolicy.name,
        description: unmappedPolicy.description,
        policy: {
          regoContent: unmappedPolicy.regoContent,
          message: unmappedPolicy.message,
        },
      });
    });

    it("should return the mapped policy with an empty message if not provided", () => {
      unmappedPolicy.message = null;
      const actual = mapToApiModel(request);

      expect(actual).toEqual({
        name: unmappedPolicy.name,
        description: unmappedPolicy.description,
        policy: {
          regoContent: unmappedPolicy.regoContent,
          message: "",
        },
      });
    });
  });

  describe("getPolicyByPolicyId", () => {
    let accessToken, policyId, fetchResponse, unmappedPolicy, actualResponse;

    beforeEach(() => {
      accessToken = chance.string();
      policyId = chance.guid();
      unmappedPolicy = {
        [chance.string()]: chance.string(),
        id: policyId,
        name: chance.string(),
        description: chance.string(),
        policy: {
          regoContent: chance.string(),
          id: chance.string(),
          version: chance.d4(),
        },
        currentVersion: chance.d4().toString(),
      };
      fetchResponse = {
        status: StatusCodes.OK,
        ok: true,
        json: jest.fn().mockResolvedValue(unmappedPolicy),
      };
    });

    describe("happy path", () => {
      beforeEach(async () => {
        get.mockResolvedValue(fetchResponse);
        actualResponse = await getPolicyByPolicyId(policyId, accessToken);
      });

      it("should call to fetch the policy", () => {
        expect(get).toHaveBeenCalledWith(
          `/v1alpha1/policies/${policyId}`,
          accessToken
        );
      });

      it("should return the mappedPolicy", () => {
        expect(actualResponse.error).toBeUndefined();
        expect(actualResponse).toEqual({
          data: {
            id: policyId,
            name: unmappedPolicy.name,
            description: unmappedPolicy.description,
            regoContent: unmappedPolicy.policy.regoContent,
            currentVersion: unmappedPolicy.currentVersion,
            policyVersionId: unmappedPolicy.policy.id,
            policyVersion: unmappedPolicy.policy.version,
          },
          status: StatusCodes.OK,
        });
      });
    });

    describe("sad path", () => {
      it("should return null if the policy is not found", async () => {
        get.mockRejectedValue(new RodeClientError(StatusCodes.NOT_FOUND));
        actualResponse = await getPolicyByPolicyId(policyId, accessToken);

        expect(actualResponse).toEqual({
          status: StatusCodes.OK,
          data: null,
        });
      });

      it("should return an error when the call fails", async () => {
        get.mockResolvedValue(
          new RodeClientError(StatusCodes.INTERNAL_SERVER_ERROR)
        );
        actualResponse = await getPolicyByPolicyId(policyId);

        expect(actualResponse).toEqual({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      });

      it("should return an error when the response json fails to parse", async () => {
        fetchResponse.json.mockRejectedValue({});
        get.mockResolvedValue(fetchResponse);
        actualResponse = await getPolicyByPolicyId(policyId);

        expect(actualResponse).toEqual({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      });
    });
  });
});
