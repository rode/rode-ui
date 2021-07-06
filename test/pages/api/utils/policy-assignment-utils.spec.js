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

import { mapToClientModelWithPolicyDetails } from "pages/api/utils/policy-assignment-utils";
import { getPolicyByPolicyId } from "pages/api/utils/policy-utils";

jest.mock("pages/api/utils/policy-utils");

describe("policy-assignment-utils", () => {
  describe("mapToClientModelWithPolicyDetails", () => {
    let assignment, policyId, policyVersion, policy;

    beforeEach(() => {
      policyId = chance.guid();
      policyVersion = chance.d4().toString();
      assignment = {
        [chance.string()]: chance.string(),
        policyVersionId: `${policyId}.${policyVersion}`,
      };

      policy = {
        [chance.string()]: chance.string(),
        name: chance.string(),
        id: policyId,
        policyVersion,
        currentVersion: Number(policyVersion) + 1,
      };
    });

    it("should return the mapped assignment with the found policy details", async () => {
      getPolicyByPolicyId.mockResolvedValue({
        data: policy,
        error: null,
      });

      const actual = await mapToClientModelWithPolicyDetails(assignment);

      expect(getPolicyByPolicyId).toHaveBeenCalledWith(
        assignment.policyVersionId
      );

      expect(actual).toEqual({
        ...assignment,
        policyId,
        policyVersion,
        policyName: policy.name,
        policyVersionCount: policy.currentVersion,
      });
    });

    it("should throw an error if fetching the policy failed", async () => {
      getPolicyByPolicyId.mockResolvedValue({
        data: null,
        error: chance.string(),
      });

      try {
        await mapToClientModelWithPolicyDetails(assignment);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain(
          `Error while fetching policy ${assignment.policyVersionId} for policy group assignments.`
        );
      }

      expect.assertions(2);
    });
  });
});
