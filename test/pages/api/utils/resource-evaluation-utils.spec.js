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

import { mapToClientModelWithPolicyDetails } from "pages/api/utils/resource-evaluation-utils";
import { getPolicyByPolicyId } from "pages/api/utils/policy-utils";

jest.mock("pages/api/utils/policy-utils");

describe("resource-evaluation-utils", () => {
  describe("mapToClientModelWithPolicyDetails", () => {
    let evaluation, policy;

    beforeEach(() => {
      const policyId = chance.guid();
      const policyVersion = chance.d4();
      evaluation = {
        resourceEvaluation: {
          [chance.string()]: chance.string(),
          resourceVersion: {
            version: chance.string(),
            names: chance.n(chance.string, chance.d4()),
          },
        },
        policyEvaluations: [
          {
            [chance.string()]: chance.string(),
            policyVersionId: `${policyId}.${policyVersion}`,
          },
        ],
      };

      policy = {
        [chance.string()]: chance.string(),
        name: chance.string(),
        id: policyId,
        policyVersion,
        currentVersion: Number(policyVersion) + 1,
      };
    });

    it("should return the mapped evaluation with the found policy details", async () => {
      getPolicyByPolicyId.mockResolvedValue({
        data: policy,
        error: null,
      });

      const actual = await mapToClientModelWithPolicyDetails(evaluation);

      expect(getPolicyByPolicyId).toHaveBeenCalledWith(
        evaluation.policyEvaluations[0].policyVersionId
      );

      expect(actual).toEqual({
        ...evaluation.resourceEvaluation,
        resourceUri: evaluation.resourceEvaluation.resourceVersion.version,
        resourceAliases: evaluation.resourceEvaluation.resourceVersion.names,
        policyEvaluations: [
          {
            ...evaluation.policyEvaluations[0],
            policyVersion: policy.policyVersion,
            policyId: policy.id,
            policyName: policy.name,
          },
        ],
      });
    });

    it("should throw an error if fetching the policy failed", async () => {
      getPolicyByPolicyId.mockResolvedValue({
        data: null,
        error: chance.string(),
      });

      try {
        await mapToClientModelWithPolicyDetails(evaluation);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain(
          `Error while fetching policy ${evaluation.policyEvaluations[0].policyVersionId} for resource evaluations.`
        );
      }

      expect.assertions(2);
    });
  });
});
