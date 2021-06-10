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

import { mapToClientModel, mapToApiModel } from "pages/api/utils/policy-utils";

describe("policy-utils", () => {
  describe("mapToClientModel", () => {
    it("should return the mapped policy matching the client model", () => {
      const unmapped = {
        [chance.string()]: chance.string(),
        id: chance.string(),
        name: chance.string(),
        description: chance.string(),
        policy: {
          [chance.string()]: chance.string(),
          regoContent: chance.string(),
        },
      };

      const actual = mapToClientModel(unmapped);

      expect(actual).toEqual({
        id: unmapped.id,
        name: unmapped.name,
        description: unmapped.description,
        regoContent: unmapped.policy.regoContent,
      });
    });
  });

  describe("mapToApiModel", () => {
    it("should return the mapped policy matching the api model", () => {
      const unmapped = {
        [chance.string()]: chance.string(),
        name: chance.string(),
        description: chance.string(),
        regoContent: chance.string(),
      };

      const actual = mapToApiModel(unmapped);

      expect(actual).toEqual({
        name: unmapped.name,
        description: unmapped.description,
        policy: {
          regoContent: unmapped.regoContent,
        },
      });
    });
  });
});
