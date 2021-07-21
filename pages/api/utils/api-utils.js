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
import * as nodeFetch from "node-fetch";

export class RodeClientError extends Error {
  constructor(statusCode, responseText) {
    super();

    this.name = "RodeClientError";
    this.statusCode = statusCode;
    this.responseText = responseText;

    this.message = `Request failed (${statusCode}): ${responseText}`;
  }
}

const fetch = async ({ endpoint, method, body, accessToken }) => {
  const options = {
    method,
    headers: {},
  };

  if (body) {
    options.body = typeof body === "object" ? JSON.stringify(body) : body;
    options.headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    options.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const rodeUrl = config.get("rode.url");
  const response = await nodeFetch(`${rodeUrl}${endpoint}`, options);
  if (response.ok) {
    return response;
  }

  const responseText = await response.text();

  throw new RodeClientError(response.statusCode, responseText);
};

export const post = (endpoint, body, accessToken) =>
  fetch({
    accessToken,
    body,
    endpoint,
    method: "POST",
  });

export const patch = (endpoint, body, accessToken) =>
  fetch({
    accessToken,
    body,
    endpoint,
    method: "PATCH",
  });

export const get = (endpoint, accessToken) =>
  fetch({
    accessToken,
    endpoint,
    method: "GET",
  });

export const del = (endpoint, accessToken) =>
  fetch({
    accessToken,
    endpoint,
    method: "DELETE",
  });

export const buildPaginationParams = (request) => {
  let params = {};

  if (request.query.pageSize) {
    params.pageSize = request.query.pageSize;
  }
  if (request.query.pageToken) {
    params.pageToken = request.query.pageToken;
  }

  return params;
};
