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
import {
  post,
  patch,
  get,
  del,
  buildPaginationParams,
  RodeClientError,
} from "pages/api/utils/api-utils";
import fetch from "node-fetch";

jest.mock("node-fetch");

describe("api-utils", () => {
  let endpoint,
    body,
    accessToken,
    response,
    expectedResponseText,
    expectedStatusCode,
    expectedUrl;

  beforeEach(() => {
    endpoint = `/${chance.word()}`;
    expectedUrl = `${config.get("rode.url")}${endpoint}`;
    accessToken = chance.string();
    body = {
      [chance.string()]: chance.string(),
    };

    expectedResponseText = chance.string();
    expectedStatusCode = chance.integer({ min: 200, max: 500 });
    response = {
      ok: true,
      status: expectedStatusCode,
      text: jest.fn().mockResolvedValue(expectedResponseText),
    };

    fetch.mockResolvedValue(response);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("post", () => {
    it("should call fetch with the appropriate params", async () => {
      await post(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
    });

    it("should pass the raw body if it is not an object", async () => {
      body = chance.string();

      await post(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body,
      });
    });

    it("should include the access token in the request", async () => {
      await post(endpoint, body, accessToken);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      });
    });

    describe("non-200 response", () => {
      it("should throw an error", async () => {
        expect.hasAssertions();
        response.ok = false;

        try {
          await post(endpoint, body, accessToken);
        } catch (error) {
          expect(error).toBeInstanceOf(RodeClientError);
          expect(error.responseText).toEqual(expectedResponseText);
          expect(error.statusCode).toEqual(expectedStatusCode);
        }
      });
    });
  });

  describe("patch", () => {
    it("should call fetch with the appropriate params", async () => {
      await patch(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(body),
      });
    });

    it("should pass the raw body if it is not an object", async () => {
      body = chance.string();

      await patch(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body,
      });
    });

    it("should include the access token if present", async () => {
      await patch(endpoint, body, accessToken);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(body),
      });
    });

    describe("non-200 response", () => {
      it("should throw an error", async () => {
        expect.hasAssertions();
        response.ok = false;

        try {
          await patch(endpoint, body, accessToken);
        } catch (error) {
          expect(error).toBeInstanceOf(RodeClientError);
          expect(error.responseText).toEqual(expectedResponseText);
          expect(error.statusCode).toEqual(expectedStatusCode);
        }
      });
    });
  });

  describe("get", () => {
    it("should call fetch with the appropriate params", async () => {
      await get(endpoint);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {},
        method: "GET",
      });
    });

    it("should include the access token if present", async () => {
      await get(endpoint, accessToken);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
      });
    });

    describe("non-200 response", () => {
      it("should throw an error", async () => {
        expect.hasAssertions();
        response.ok = false;

        try {
          await get(endpoint, accessToken);
        } catch (error) {
          expect(error).toBeInstanceOf(RodeClientError);
          expect(error.responseText).toEqual(expectedResponseText);
          expect(error.statusCode).toEqual(expectedStatusCode);
        }
      });
    });
  });

  describe("del", () => {
    it("should call fetch with the appropriate params", async () => {
      await del(endpoint);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {},
        method: "DELETE",
      });
    });

    it("should include the access token if present", async () => {
      await del(endpoint, accessToken);

      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: "DELETE",
      });
    });

    describe("non-200 response", () => {
      it("should throw an error", async () => {
        expect.hasAssertions();
        response.ok = false;

        try {
          await del(endpoint, accessToken);
        } catch (error) {
          expect(error).toBeInstanceOf(RodeClientError);
          expect(error.responseText).toEqual(expectedResponseText);
          expect(error.statusCode).toEqual(expectedStatusCode);
        }
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
