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

import { getPolicyByPolicyId } from "./policy-utils";

const mapPolicyEvaluations = async (policyEvaluation) => {
  const { data, error } = await getPolicyByPolicyId(
    policyEvaluation.policyVersionId
  );

  if (error) {
    throw Error(
      `Error while fetching policy ${policyEvaluation.policyVersionId} for resource evaluations.`
    );
  }

  return {
    ...policyEvaluation,
    policyVersion: data.policyVersion,
    policyId: data.id,
    policyName: data.name,
  };
};

export const mapToClientModelWithPolicyDetails = async (evaluation) => {
  const mappedPolicyEvaluations = await Promise.all(
    evaluation.policyEvaluations.map(mapPolicyEvaluations)
  );

  return {
    ...evaluation.resourceEvaluation,
    resourceUri: evaluation.resourceEvaluation.resourceVersion.version,
    resourceAliases: evaluation.resourceEvaluation.resourceVersion.names,
    policyEvaluations: mappedPolicyEvaluations,
  };
};
