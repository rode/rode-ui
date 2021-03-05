import { getVulnerabilityBreakdown } from "utils/occurrence-utils";

describe("occurrence-utils", () => {
  describe("getVulnerabilityBreakdown", () => {
    let vulnerabilities;

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
