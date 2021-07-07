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

import config from "config";
import { get } from "./api-utils";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const mapToClientModel = (policyResponse) => {
  return {
    id: policyResponse.id,
    name: policyResponse.name,
    description: policyResponse.description,
    regoContent: policyResponse.policy.regoContent,
    currentVersion: policyResponse.currentVersion,
    policyVersionId: policyResponse.policy.id,
    policyVersion: policyResponse.policy.version,
  };
};

export const mapToApiModel = (request) => {
  let formattedRequest = request.body;

  return {
    name: formattedRequest.name,
    description: formattedRequest.description,
    policy: {
      regoContent: formattedRequest.regoContent,
      message: formattedRequest.message || "",
    },
  };
};

export const getPolicyByPolicyId = async (policyId, accessToken) => {
  try {
    const response = await get(
      `${config.get("rode.url")}/v1alpha1/policies/${policyId}`,
      accessToken
    );

    if (response.status === StatusCodes.NOT_FOUND) {
      return {
        status: StatusCodes.OK,
        data: null,
      };
    }

    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      };
    }

    const getPolicyResponse = await response.json();

    const policy = mapToClientModel(getPolicyResponse);

    return {
      status: StatusCodes.OK,
      data: policy,
    };
  } catch (error) {
    console.error("Error getting policy", error);

    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    };
  }
};
