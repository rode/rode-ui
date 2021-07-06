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

jest.mock("express-openid-connect");

import config from "config";
import { auth } from "express-openid-connect";
import { oidc, tokenRefresh } from "server/middleware.mjs";

describe("middleware", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("oidc", () => {
    let expectedAuthMiddleware;

    beforeEach(() => {
      expectedAuthMiddleware = () => chance.word();
      auth.mockReturnValue(expectedAuthMiddleware);
    });

    it("should configure the middleware for express-openid-connect", () => {
      oidc();

      expect(auth)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({
          authRequired: false,
          authorizationParams: {
            response_type: "code",
            response_mode: "form_post",
            scope: config.get("oidc.scope"),
          },
          baseURL: config.get("app.url"),
          clientID: config.get("oidc.clientId"),
          clientSecret: config.get("oidc.clientSecret"),
          enableTelemetry: false,
          idpLogout: true,
          issuerBaseURL: config.get("oidc.issuerUrl"),
          routes: {
            callback: "/callback",
            login: "/login",
            logout: "/logout",
            postLogoutRedirect: "/",
          },
          secret: config.get("app.secret"),
        });
    });

    it("should return the middleware", () => {
      const actualMiddleware = oidc();

      expect(actualMiddleware).toEqual(expectedAuthMiddleware);
    });
  });

  describe("tokenRefresh", () => {
    let request,
      response,
      next,
      refresh,
      isExpired,
      nextAccessToken,
      accessToken;

    beforeEach(() => {
      accessToken = chance.word();
      nextAccessToken = chance.string();
      refresh = jest.fn().mockResolvedValue({ access_token: nextAccessToken });
      isExpired = jest.fn().mockReturnValue(false);
      next = jest.fn();

      request = {
        oidc: {
          accessToken: {
            access_token: accessToken,
            isExpired,
            refresh,
          },
        },
      };
      response = {
        redirect: jest.fn(),
      };
    });

    it("should add the access token to the request context", async () => {
      await tokenRefresh()(request, response, next);

      expect(request.accessToken).toEqual(accessToken);
      expect(next).toHaveBeenCalled();
      expect(refresh).not.toHaveBeenCalled();
      expect(response.redirect).not.toHaveBeenCalled();
    });

    describe("the token is expired", () => {
      beforeEach(() => {
        isExpired.mockReturnValue(true);
      });

      it("should refresh the token", async () => {
        isExpired.mockReturnValue(true);

        await tokenRefresh()(request, response, next);

        expect(request.accessToken).toEqual(nextAccessToken);
        expect(refresh).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(response.redirect).not.toHaveBeenCalled();
      });

      it("should redirect the request to the login route if the refresh fails", async () => {
        refresh.mockRejectedValue(new Error("refresh failed"));

        await tokenRefresh()(request, response, next);

        expect(request.accessToken).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
        expect(response.redirect)
          .toHaveBeenCalledTimes(1)
          .toHaveBeenCalledWith("/login");
      });
    });
  });
});
