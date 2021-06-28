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

const getPolicyIdAndVersion = (policyVersionId) => {
  const [policyId, policyVersion] = policyVersionId.split(".");

  return {
    policyId,
    policyVersion,
  };
};

export const mapToClientModelWithPolicyDetails = async (assignment) => {
  const { policyId, policyVersion } = getPolicyIdAndVersion(
    assignment.policyVersionId
  );

  const { data, error } = await getPolicyByPolicyId(policyId);

  if (error) {
    throw Error(
      `Error while fetching policy ${policyId} for policy group assignments.`
    );
  }

  return {
    ...assignment,
    policyId,
    policyVersion,
    policyName: data.name,
  };
};
