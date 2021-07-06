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

// This randomly generated config is used by the unit tests. Jest will set NODE_ENV=test.
module.exports = {
  app: {
    dev: chance.bool(),
    secret: chance.string(),
    url: chance.url(),
  },
  rode: {
    url: chance.url(),
  },
  oidc: {
    clientId: chance.word(),
    clientSecret: chance.guid(),
    enabled: chance.bool(),
    issuerUrl: chance.url(),
    scope: chance.word(),
  },
};
