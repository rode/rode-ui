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
import login from "server/routes/login.mjs";

describe("login", () => {
  let expectedPath, request, response;

  beforeEach(() => {
    expectedPath = `/${chance.word()}`;
    request = {
      query: {
        returnTo: expectedPath,
      },
    };
    response = {
      oidc: {
        login: jest.fn(),
      },
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const expectedRedirect = (path) => `${config.get("app.url")}${path}`;

  it("should redirect to login", () => {
    login(request, response);

    expect(response.oidc.login)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        returnTo: expectedRedirect(expectedPath),
      });
  });

  describe("no redirect specified", () => {
    it("should redirect to the app url", () => {
      delete request.query.returnTo;

      login(request, response);

      expect(response.oidc.login)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({
          returnTo: expectedRedirect("/"),
        });
    });
  });

  describe("redirects", () => {
    it.each([
      ["wwww.google.com", false],
      ["https://www.google.com", false],
      ["//google.com", false],
      ["file://www.google.com", false],
      ["/foo-bar", true],
      ["/foo?bar=baz", true],
      ["/foo#bar", true],
    ])("post-login redirect to %s is allowed (%s)", (redirect, valid) => {
      request.query.returnTo = redirect;

      login(request, response);

      const expected = expectedRedirect(valid ? redirect : "/");

      expect(response.oidc.login)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({
          returnTo: expected,
        });
    });
  });
});
