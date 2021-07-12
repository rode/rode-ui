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
import { getServerSideProps } from "utils/server";

describe("server utils", () => {
  describe("getServerSideProps", () => {
    let ctx, expectedName, expectedIsAuthenticated;

    beforeEach(() => {
      expectedName = chance.word();
      expectedIsAuthenticated = chance.bool();

      ctx = {
        req: {
          oidc: {
            user: {
              name: expectedName,
            },
            isAuthenticated: jest.fn().mockReturnValue(expectedIsAuthenticated),
          },
        },
      };
    });

    it("should map the values from the oidc context to props", async () => {
      const actualProps = await getServerSideProps(ctx);

      expect(actualProps.props.auth).toEqual({
        enabled: config.get("oidc.enabled"),
        user: {
          name: expectedName,
          isAuthenticated: expectedIsAuthenticated,
        },
      });
    });

    describe("oidc context is not available", () => {
      beforeEach(() => {
        delete ctx.req.oidc;
      });

      it("should return the fallback values", async () => {
        const actualProps = await getServerSideProps(ctx);

        expect(actualProps.props.auth).toEqual({
          enabled: config.get("oidc.enabled"),
          user: {
            name: "",
            isAuthenticated: false,
          },
        });
      });
    });

    describe("user is not part of the oidc context", () => {
      beforeEach(() => {
        delete ctx.req.oidc.user;
      });

      it("should return the fallback value for user name", async () => {
        const actualProps = await getServerSideProps(ctx);

        expect(actualProps.props.auth.user.name).toEqual("");
      });
    });
  });
});
