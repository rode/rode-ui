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

jest.mock("express");
jest.mock("next");
jest.mock("../../server/middleware.mjs");

import config from "config";
import express from "express";
import next from "next";
import { oidc, tokenRefresh } from "server/middleware.mjs";
import { configureGracefulShutdown, newApp } from "server/server.mjs";

describe("server", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("newApp", () => {
    let isAppDev,
      oidcMiddleware,
      tokenRefreshMiddleware,
      expectedHandler,
      app,
      nextApp;

    beforeEach(() => {
      app = {
        all: jest.fn(),
        disable: jest.fn(),
        use: jest.fn(),
      };
      expectedHandler = () => chance.word();
      nextApp = {
        getRequestHandler: jest.fn().mockReturnValue(expectedHandler),
        prepare: jest.fn().mockResolvedValue(),
      };
      oidcMiddleware = () => chance.word();
      tokenRefreshMiddleware = () => chance.word();
      isAppDev = chance.bool();
      config.get = jest.fn((path) => {
        return {
          "oidc.enabled": true,
          "app.dev": isAppDev,
        }[path];
      });

      oidc.mockReturnValue(oidcMiddleware);
      tokenRefresh.mockReturnValue(tokenRefreshMiddleware);

      express.mockReturnValue(app);
      next.mockReturnValue(nextApp);
    });

    it("should disable the x-powered-by header", async () => {
      await newApp();

      expect(app.disable)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("x-powered-by");
    });

    it("should register the oidc and token refresh middleware", async () => {
      await newApp();

      expect(app.use)
        .toHaveBeenCalledTimes(2)
        .toHaveBeenCalledWith(oidcMiddleware)
        .toHaveBeenCalledWith(tokenRefreshMiddleware);
    });

    it("should configure the Next.js routes and register the handler", async () => {
      await newApp();

      expect(next)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith({ dev: isAppDev });
      expect(nextApp.prepare).toHaveBeenCalledTimes(1);
      expect(app.all)
        .toHaveBeenCalledTimes(1)
        .toHaveBeenCalledWith("*", expectedHandler);
    });

    it("should return the app", async () => {
      const actualApp = await newApp();

      expect(actualApp).toBe(app);
    });

    describe("oidc is disabled", () => {
      beforeEach(() => {
        config.get.mockReturnValue(false);
      });

      it("should not register any middleware", async () => {
        await newApp();

        expect(app.use).not.toHaveBeenCalled();
      });
    });
  });

  describe("configureGracefulShutdown", () => {
    let server;

    beforeEach(() => {
      process.exit = jest.fn();
      process.once = jest.fn();

      server = {
        close: jest.fn(),
      };
    });

    it.each([
      ["SIGINT", 0],
      ["SIGTERM", 1],
    ])("should register a handler for %s", (signal, callIndex) => {
      configureGracefulShutdown(server);

      expect(process.once)
        .toHaveBeenCalledTimes(2)
        .toHaveBeenCalledWith(signal, expect.any(Function));

      const signalHandler = process.once.mock.calls[callIndex][1];

      signalHandler();
      expect(server.close).toHaveBeenCalledTimes(1);

      const closeHandler = server.close.mock.calls[0][0];
      closeHandler();

      expect(process.exit).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(0);

      process.exit.mockReset();
      closeHandler(chance.word());

      expect(process.exit).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(1);
    });
  });
});
