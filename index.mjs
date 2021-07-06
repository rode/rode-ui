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
import { newApp, configureGracefulShutdown } from "./server/server.mjs";

const listen = (app) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(3000, "0.0.0.0", (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(server);
    });
  });
};

try {
  const app = await newApp();
  const server = await listen(app);
  configureGracefulShutdown(server);
  console.log(
    `Server listening on ${server.address().address}:${server.address().port}`
  );
} catch (error) {
  console.error("Error starting server", error);
  process.exit(1);
}
