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

import { getRodeUrl, post, patch, get, del } from "pages/api/utils/api-utils";
import fetch from "node-fetch";

jest.mock("node-fetch");

describe("api-utils", () => {
  describe("getRodeUrl", () => {
    it("should return the environment variable if set", () => {
      const expected = chance.string();
      process.env.RODE_URL = expected;

      const actual = getRodeUrl();

      expect(actual).toEqual(expected);
    });

    it("should return the default url if environment is not set", () => {
      delete process.env.RODE_URL;
      const actual = getRodeUrl();

      expect(actual).toEqual("http://localhost:50051");
    });
  });

  describe("post", () => {
    let body, endpoint;

    it("should call fetch with the appropriate params", () => {
      body = {
        [chance.string()]: chance.string(),
      };

      endpoint = chance.url();

      post(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });
    });

    it("should pass the raw body if it is not an object", () => {
      body = chance.string();
      endpoint = chance.url();
      post(endpoint, body);
      expect(fetch).toHaveBeenCalledWith(endpoint, {
        method: "POST",
        body,
      });
    });
  });

  describe("patch", () => {
    let body, endpoint;
    it("should call fetch with the appropriate params", () => {
      body = {
        [chance.string()]: chance.string(),
      };

      endpoint = chance.url();

      patch(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    });

    it("should pass the raw body if it is not an object", () => {
      body = chance.string();
      endpoint = chance.url();

      patch(endpoint, body);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        method: "PATCH",
        body,
      });
    });
  });

  describe("get", () => {
    it("should call fetch with the appropriate params", () => {
      const endpoint = chance.url();

      get(endpoint);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        method: "GET",
      });
    });
  });

  describe("del", () => {
    it("should call fetch with the appropriate params", () => {
      const endpoint = chance.url();

      del(endpoint);

      expect(fetch).toHaveBeenCalledWith(endpoint, {
        method: "DELETE",
      });
    });
  });
});
