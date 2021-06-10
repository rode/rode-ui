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

import * as nodeFetch from "node-fetch";

export const getRodeUrl = () =>
  process.env.RODE_URL || "http://localhost:50051";

const fetch = (endpoint, method, body) => {
  const options = {
    method,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return nodeFetch(endpoint, options);
};

export const post = (endpoint, body) => fetch(endpoint, "POST", body);

export const patch = (endpoint, body) => fetch(endpoint, "PATCH", body);

export const get = (endpoint) => fetch(endpoint, "GET");

export const del = (endpoint) => fetch(endpoint, "DELETE");
