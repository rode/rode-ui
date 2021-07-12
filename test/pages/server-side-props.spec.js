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
import glob from "glob";

describe("getServerSideProps", () => {
  const pagesDir = "pages";
  // getServerSideProps is used for conveying authentication information from a HttpOnly session cookie.
  // Every page must implement it, it can't be set on a custom <App />.
  it("should export getServerSideProps on every page", async () => {
    const files = glob.sync(`${pagesDir}/**/*.js`, {
      ignore: [
        `${pagesDir}/_*.js`,
        `${pagesDir}/404.js`,
        `${pagesDir}/api/**/*.js`,
      ],
    });
    expect(files.length).toBeGreaterThan(0);

    files.forEach((file) => {
      const module = require(file);

      try {
        expect(module.getServerSideProps).toBeDefined();
      } catch (error) {
        throw new Error(
          `expected ${file} to export getServerSideProps: ${error}`
        );
      }
    });
  });
});
