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

import { getVulnerabilityBreakdown } from "utils/occurrence-utils";

describe("occurrence-utils", () => {
  describe("getVulnerabilityBreakdown", () => {
    let vulnerabilities;

    it("should return the correct count for any critical severity vulnerabilities", () => {
      vulnerabilities = chance.n(
        () => ({ effectiveSeverity: "CRITICAL" }),
        chance.d4()
      );
      const actual = getVulnerabilityBreakdown(vulnerabilities);

      expect(actual).toBe(`${vulnerabilities.length} critical`);
    });

    it("should return the correct count for any high severity vulnerabilities", () => {
      vulnerabilities = chance.n(
        () => ({ effectiveSeverity: "HIGH" }),
        chance.d4()
      );
      const actual = getVulnerabilityBreakdown(vulnerabilities);

      expect(actual).toBe(`${vulnerabilities.length} high`);
    });

    it("should return the correct count for any medium severity vulnerabilities", () => {
      vulnerabilities = chance.n(
        () => ({ effectiveSeverity: "MEDIUM" }),
        chance.d4()
      );
      const actual = getVulnerabilityBreakdown(vulnerabilities);

      expect(actual).toBe(`${vulnerabilities.length} medium`);
    });

    it("should return the correct count for any low severity vulnerabilities", () => {
      vulnerabilities = chance.n(
        () => ({ effectiveSeverity: "LOW" }),
        chance.d4()
      );
      const actual = getVulnerabilityBreakdown(vulnerabilities);

      expect(actual).toBe(`${vulnerabilities.length} low`);
    });

    it("should return the correct count for any unknown severity vulnerabilities", () => {
      vulnerabilities = chance.n(
        () => ({ effectiveSeverity: chance.string() }),
        chance.d4()
      );
      const actual = getVulnerabilityBreakdown(vulnerabilities);

      expect(actual).toBe(`${vulnerabilities.length} unknown`);
    });
  });
});
