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
import express from "express";
import next from "next";
import { oidc, tokenRefresh } from "./middleware.mjs";

export const newApp = async () => {
  const app = express();
  app.disable("x-powered-by");

  if (config.get("oidc.enabled")) {
    app.use(oidc());
    app.use(tokenRefresh());
  }

  const nextApp = next({ dev: config.get("app.dev") });

  await nextApp.prepare();

  app.all("*", nextApp.getRequestHandler());

  return app;
};

export const configureGracefulShutdown = (server) => {
  const handler = (signal) => () => {
    console.log(`Received ${signal}, stopping server`);
    server.close((error) => {
      let exitCode = 0;
      if (error) {
        console.error("Error occurred stopping server", error);
        exitCode = 1;
      }

      process.exit(exitCode);
    });
  };

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.once(signal, handler(signal));
  });
};
