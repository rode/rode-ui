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

import {
  createMockOccurrence,
  createMockResourceUri,
} from "test/testing-utils/mocks";
import { mapOccurrencesToSections } from "pages/api/utils/occurrence-utils";

describe("occurrence-utils", () => {
  describe("mapOccurrencesToSections", () => {
    it("should group the occurrences by their types", () => {
      const buildOccurrence = createMockOccurrence("BUILD");
      const deploymentOccurrence = createMockOccurrence("DEPLOYMENT");
      const randomOccurrence = createMockOccurrence(chance.string());

      const resourceUri = buildOccurrence.build.provenance.builtArtifacts[0].id;

      const allOccurrences = [
        buildOccurrence,
        deploymentOccurrence,
        randomOccurrence,
      ];

      const mappedOccurrences = mapOccurrencesToSections(
        allOccurrences,
        resourceUri
      );

      expect(mappedOccurrences.build).toHaveLength(1);
      expect(mappedOccurrences.deploy).toHaveLength(1);
      expect(mappedOccurrences.other).toHaveLength(1);
      expect(mappedOccurrences.other).toContain(randomOccurrence);
      expect(mappedOccurrences.originals).toEqual({
        occurrences: allOccurrences,
      });
    });

    describe("vulnerabilities", () => {
      let startScanOccurrence,
        endScanOccurrence,
        matchingVulnerability,
        noteName;

      beforeEach(() => {
        noteName = "harbor-scan";

        startScanOccurrence = createMockOccurrence("DISCOVERY", noteName);
        startScanOccurrence.discovered.discovered.analysisStatus = "SCANNING";
        endScanOccurrence = createMockOccurrence("DISCOVERY", noteName);
        endScanOccurrence.discovered.discovered.analysisStatus =
          "FINISHED_SUCCESS";
        matchingVulnerability = createMockOccurrence("VULNERABILITY", noteName);
      });

      describe("harbor scans", () => {
        it("should match up vulnerabilities with a scan start and end", () => {
          const { secure } = mapOccurrencesToSections([
            startScanOccurrence,
            endScanOccurrence,
            matchingVulnerability,
            createMockOccurrence("VULNERABILITY"),
          ]);

          expect(secure).toHaveLength(1);
          expect(secure[0].started).toEqual(startScanOccurrence.createTime);
          expect(secure[0].completed).toEqual(endScanOccurrence.createTime);
          expect(secure[0].originals.occurrences).toContain(
            startScanOccurrence
          );
          expect(secure[0].originals.occurrences).toContain(endScanOccurrence);
          expect(secure[0].originals.occurrences).toContain(
            matchingVulnerability
          );
        });

        it("should return starting scans with no matching end scan as In Progress", () => {
          const startScanOccurrence = createMockOccurrence(
            "DISCOVERY",
            "harbor-scan"
          );
          startScanOccurrence.discovered.discovered.analysisStatus = "SCANNING";
          const { secure, other } = mapOccurrencesToSections([
            startScanOccurrence,
            createMockOccurrence("VULNERABILITY"),
          ]);

          expect(secure).toHaveLength(1);
          expect(secure[0].completed).toBeNull();
          expect(secure[0].vulnerabilities).toHaveLength(0);
          expect(other).toHaveLength(1);
        });
      });

      describe("tfsec scans", () => {
        beforeEach(() => {
          noteName = "tfsec";

          startScanOccurrence = createMockOccurrence("DISCOVERY", noteName);
          startScanOccurrence.discovered.discovered.analysisStatus = "SCANNING";
          endScanOccurrence = createMockOccurrence("DISCOVERY", noteName);
          endScanOccurrence.discovered.discovered.analysisStatus =
            "FINISHED_SUCCESS";
          matchingVulnerability = createMockOccurrence(
            "VULNERABILITY",
            noteName
          );
          endScanOccurrence.createTime = startScanOccurrence.createTime;
          matchingVulnerability.createTime = startScanOccurrence.createTime;
        });

        it("should match up vulnerabilities with a scan start and end", () => {
          const { secure } = mapOccurrencesToSections([
            startScanOccurrence,
            endScanOccurrence,
            matchingVulnerability,
            createMockOccurrence("VULNERABILITY"),
          ]);

          expect(secure).toHaveLength(1);
          expect(secure[0].started).toEqual(startScanOccurrence.createTime);
          expect(secure[0].completed).toEqual(endScanOccurrence.createTime);
          expect(secure[0].originals.occurrences).toContain(
            startScanOccurrence
          );
          expect(secure[0].originals.occurrences).toContain(endScanOccurrence);
          expect(secure[0].originals.occurrences).toContain(
            matchingVulnerability
          );
        });

        it("should return starting scans with no matching end scan as In Progress", () => {
          const startScanOccurrence = createMockOccurrence(
            "DISCOVERY",
            "tfsec"
          );
          startScanOccurrence.discovered.discovered.analysisStatus = "SCANNING";
          const { secure, other } = mapOccurrencesToSections([
            startScanOccurrence,
            createMockOccurrence("VULNERABILITY"),
          ]);

          expect(secure).toHaveLength(1);
          expect(secure[0].completed).toBeNull();
          expect(secure[0].vulnerabilities).toHaveLength(0);
          expect(other).toHaveLength(1);
        });
      });

      it("should correctly map the vulnerabilities", () => {
        const { secure } = mapOccurrencesToSections([
          startScanOccurrence,
          endScanOccurrence,
          matchingVulnerability,
          createMockOccurrence("VULNERABILITY"),
        ]);

        expect(secure[0].vulnerabilities).toHaveLength(1);

        const vulnerability = secure[0].vulnerabilities[0];

        expect(vulnerability.name).toEqual(matchingVulnerability.name);
        expect(vulnerability.type).toEqual(
          matchingVulnerability.vulnerability.type
        );
        expect(vulnerability.cvssScore).toEqual(
          matchingVulnerability.vulnerability.cvssScore
        );
        expect(vulnerability.severity).toEqual(
          matchingVulnerability.vulnerability.severity
        );
        expect(vulnerability.effectiveSeverity).toEqual(
          matchingVulnerability.vulnerability.effectiveSeverity
        );
        expect(vulnerability.description).toEqual(
          matchingVulnerability.vulnerability.shortDescription
        );
        expect(vulnerability.relatedUrls).toEqual(
          matchingVulnerability.vulnerability.relatedUrls
        );
        expect(vulnerability.cpeUri).toEqual(
          matchingVulnerability.vulnerability.packageIssue[0].affectedLocation
            .cpeUri
        );
        expect(vulnerability.packageName).toEqual(
          matchingVulnerability.vulnerability.packageIssue[0].affectedLocation
            .package
        );
        expect(vulnerability.version).toEqual(
          matchingVulnerability.vulnerability.packageIssue[0].affectedLocation
            .version
        );
      });

      it("should sort the vulnerabilities by their severity level", () => {
        const lowSev = createMockOccurrence("VULNERABILITY", noteName);
        lowSev.vulnerability.effectiveSeverity = "LOW";
        const medSev = createMockOccurrence("VULNERABILITY", noteName);
        medSev.vulnerability.effectiveSeverity = "MEDIUM";
        const highSev = createMockOccurrence("VULNERABILITY", noteName);
        highSev.vulnerability.effectiveSeverity = "HIGH";

        const { secure } = mapOccurrencesToSections([
          startScanOccurrence,
          endScanOccurrence,
          ...chance.shuffle([lowSev, medSev, highSev]),
        ]);

        expect(secure[0].vulnerabilities[0].effectiveSeverity).toBe("HIGH");
        expect(secure[0].vulnerabilities[1].effectiveSeverity).toBe("MEDIUM");
        expect(secure[0].vulnerabilities[2].effectiveSeverity).toBe("LOW");
      });

      it("should not return vulnerabilities if they do not have an associated scan start", () => {
        const endScanOccurrence = createMockOccurrence("DISCOVERY");
        endScanOccurrence.discovered.discovered.analysisStatus =
          "FINISHED_SUCCESS";
        const { secure, other } = mapOccurrencesToSections([
          endScanOccurrence,
          createMockOccurrence("VULNERABILITY"),
        ]);

        expect(secure).toHaveLength(0);
        expect(other).toHaveLength(2);
      });
    });

    describe("build occurrences", () => {
      it("should correctly map build occurrences", () => {
        const buildOccurrence = createMockOccurrence("BUILD");
        const resourceUri =
          buildOccurrence.build.provenance.builtArtifacts[0].id;
        const { build } = mapOccurrencesToSections(
          [buildOccurrence],
          resourceUri
        );

        expect(build[0].name).toEqual(buildOccurrence.name);
        expect(build[0].started).toEqual(
          buildOccurrence.build.provenance.startTime
        );
        expect(build[0].completed).toEqual(
          buildOccurrence.build.provenance.endTime
        );
        expect(build[0].creator).toEqual(
          buildOccurrence.build.provenance.creator
        );
        expect(build[0].artifacts).toEqual(
          buildOccurrence.build.provenance.builtArtifacts
        );
        expect(build[0].sourceUri).toEqual(
          buildOccurrence.build.provenance.sourceProvenance.context.git.url
        );
        expect(build[0].logsUri).toEqual(
          buildOccurrence.build.provenance.logsUri
        );
        expect(build[0].originals.occurrences).toContain(buildOccurrence);
      });

      it("should not include build occurrences that are related to the git resource instead of the requested resource", () => {
        const buildOccurrence = createMockOccurrence("BUILD");
        const { build } = mapOccurrencesToSections(
          [buildOccurrence],
          createMockResourceUri()
        );

        expect(build).toHaveLength(0);
      });

      it("should include all build occurrences when the requested resource is a git resource", () => {
        const buildOccurrence = createMockOccurrence("BUILD");
        const { build } = mapOccurrencesToSections(
          [buildOccurrence],
          `git://${chance.url()}@${chance.natural()}`
        );

        expect(build).toHaveLength(1);
      });
    });

    it("should correctly map deployment occurrences", () => {
      const deploymentOccurrence = createMockOccurrence("DEPLOYMENT");
      const { deploy } = mapOccurrencesToSections([deploymentOccurrence]);

      expect(deploy[0].name).toEqual(deploymentOccurrence.name);
      expect(deploy[0].deploymentStart).toEqual(
        deploymentOccurrence.deployment.deployment.deployTime
      );
      expect(deploy[0].deploymentEnd).toEqual(
        deploymentOccurrence.deployment.deployment.undeployTime
      );
      expect(deploy[0].resourceUris).toEqual(
        deploymentOccurrence.deployment.deployment.resourceUri
      );
      expect(deploy[0].platform).toEqual(
        deploymentOccurrence.deployment.deployment.platform
      );
      expect(deploy[0].originals.occurrences).toContain(deploymentOccurrence);
    });

    it("should correctly map any unknown occurrences", () => {
      const randomOccurrences = chance.n(
        () => ({ kind: chance.string() }),
        chance.d6()
      );
      const { other } = mapOccurrencesToSections(randomOccurrences);

      expect(other).toHaveLength(randomOccurrences.length);
    });
  });
});
