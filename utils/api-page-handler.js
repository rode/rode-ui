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

import { StatusCodes, ReasonPhrases, getReasonPhrase } from "http-status-codes";
import { RodeClientError } from "pages/api/utils/api-utils";

export const apiHandler = (handlers) => async (request, response) => {
  const handler = handlers[request.method.toLowerCase()];

  if (!handler) {
    return response
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ error: ReasonPhrases.METHOD_NOT_ALLOWED });
  }

  try {
    await handler(request, response);
  } catch (error) {
    if (error instanceof RodeClientError) {
      console.error("Unsuccessful response from Rode:", error.message);

      return response
        .status(error.statusCode)
        .json({ error: getReasonPhrase(error.statusCode) });
    }

    console.error("Internal server error:", error.message);
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};
