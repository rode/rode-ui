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

import {
  post,
  patch,
  get,
  del,
  buildPaginationParams,
} from "pages/api/utils/api-utils";
import fetch from "node-fetch";

jest.mock("node-fetch");

describe("api-utils", () => {
  let endpoint, body, accessToken;

  beforeEach(() => {
    endpoint = chance.url();
    accessToken = chance.string();
    body = {
      [chance.string()]: chance.string(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("post", () => {
    it("should call fetch with the appropriate params", () => {
      post(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
    });

    it("should pass the raw body if it is not an object", () => {
      body = chance.string();

      post(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body,
      });
    });

    it("should include the access token in the request", () => {
      post(endpoint, body, accessToken);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
    });
  });

  describe("patch", () => {
    it("should call fetch with the appropriate params", () => {
      patch(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(body),
      });
    });

    it("should pass the raw body if it is not an object", () => {
      body = chance.string();

      patch(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body,
      });
    });

    it("should include the access token if present", () => {
      patch(endpoint, body, accessToken);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(body),
      });
    });
  });

  describe("get", () => {
    it("should call fetch with the appropriate params", () => {
      get(endpoint);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {},
        method: "GET",
      });
    });

    it("should include the access token if present", () => {
      get(endpoint, accessToken);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      });
    });
  });

  describe("del", () => {
    it("should call fetch with the appropriate params", () => {
      del(endpoint);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {},
        method: "DELETE",
      });
    });

    it("should include the access token if present", () => {
      del(endpoint, accessToken);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "DELETE",
      });
    });
  });

  describe("buildPaginationParams", () => {
    let request;

    beforeEach(() => {
      request = {
        query: {},
      };
    });

    it("should return the pageSize param when it is present in the request", () => {
      request.query.pageSize = chance.d100();
      const actual = buildPaginationParams(request);
      expect(actual).toEqual({
        pageSize: request.query.pageSize,
      });
    });

    it("should return the pageToken param when it is present in the request", () => {
      request.query.pageToken = chance.string();
      const actual = buildPaginationParams(request);
      expect(actual).toEqual({
        pageToken: request.query.pageToken,
      });
    });
  });
});
