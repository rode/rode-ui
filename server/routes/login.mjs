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

const relativePath = new RegExp("^/[a-zA-Z0-9?/=#-]+$");

export default (req, res) => {
  let { returnTo = "/" } = req.query;
  if (!relativePath.test(returnTo)) {
    returnTo = "/";
  }

  return res.oidc.login({
    returnTo: `${config.get("app.url")}${returnTo}`,
  });
};
