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
import { del, get, patch } from "pages/api/utils/api-utils";
import {
  mapToApiModel,
  mapToClientModel,
} from "pages/api/utils/policy-group-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  get: async (req, res) => {
    const { name } = req.query;

    const response = await get(
      `/v1alpha1/policy-groups/${name}`,
      req.accessToken
    );

    // TODO: is this still necessary?
    // if (response.status === StatusCodes.NOT_FOUND) {
    //   return res.status(StatusCodes.OK).send(null);
    // }

    const getPolicyGroupResponse = await response.json();

    return res
      .status(StatusCodes.OK)
      .json(mapToClientModel(getPolicyGroupResponse));
  },
  patch: async (req, res) => {
    const { name } = req.query;

    const updateBody = mapToApiModel(req);

    const response = await patch(
      `/v1alpha1/policy-groups/${name}`,
      updateBody,
      req.accessToken
    );

    const updatePolicyGroupResponse = await response.json();
    const policy = mapToClientModel(updatePolicyGroupResponse);

    return res.status(StatusCodes.OK).json(policy);
  },
  delete: async (req, res) => {
    const { name } = req.query;

    await del(`/v1alpha1/policy-groups/${name}`, req.accessToken);

    return res.status(StatusCodes.NO_CONTENT).send(null);
  },
});
