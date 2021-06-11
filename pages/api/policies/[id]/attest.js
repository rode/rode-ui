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

import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { getRodeUrl, post } from "pages/api/utils/api-utils";

const ALLOWED_METHODS = ["POST"];

export default async (req, res) => {
  if (!ALLOWED_METHODS.includes(req.method)) {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  const rodeUrl = getRodeUrl();

  try {
    const { id } = req.query;
    const requestBody = req.body;

    const response = await post(
      `${rodeUrl}/v1alpha1/policies/${id}:attest`,
      requestBody
    );

    if (!response.ok) {
      console.error(`Unsuccessful response from Rode: ${response.status}`);

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }

    const evaluatePolicyResponse = await response.json();

    const result = {
      pass: evaluatePolicyResponse.pass,
      result: evaluatePolicyResponse.result,
      explanation: evaluatePolicyResponse.explanation,
    };

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Error evaluating policy", error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
