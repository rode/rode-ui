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
import { post } from "pages/api/utils/api-utils";
import { apiHandler } from "utils/api-page-handler";

export default apiHandler({
  post: async (req, res) => {
    const { id } = req.query;
    const requestBody = req.body;

    const response = await post(
      `/v1alpha1/policies/${id}:attest`,
      requestBody,
      req.accessToken
    );

    const evaluatePolicyResponse = await response.json();

    const result = {
      pass: evaluatePolicyResponse.pass,
      result: evaluatePolicyResponse.result,
      explanation: evaluatePolicyResponse.explanation,
    };

    return res.status(StatusCodes.OK).json(result);
  },
});
