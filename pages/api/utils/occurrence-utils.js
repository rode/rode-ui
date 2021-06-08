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
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import dayjs from "dayjs";
import { getResourceDetails, RESOURCE_TYPES } from "utils/resource-utils";

dayjs.extend(isSameOrAfter);

const severityLevels = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  SEVERITY_UNSPECIFIED: 4,
};

const sortByVulnerability = (occurrences) =>
  occurrences.sort(
    (first, second) =>
      severityLevels[first.effectiveSeverity] -
      severityLevels[second.effectiveSeverity]
  );

const mapVulnerabilities = (occurrences) => {
  const mapped = occurrences.map((occurrence) => ({
    name: occurrence.name,
    type: occurrence.vulnerability.type,
    cvssScore: occurrence.vulnerability.cvssScore,
    severity: occurrence.vulnerability.severity,
    effectiveSeverity: occurrence.vulnerability.effectiveSeverity,
    description: occurrence.vulnerability.shortDescription,
    relatedUrls: occurrence.vulnerability.relatedUrls,
    cpeUri: occurrence.vulnerability.packageIssue[0].affectedLocation.cpeUri,
    packageName:
      occurrence.vulnerability.packageIssue[0].affectedLocation.package,
    version: occurrence.vulnerability.packageIssue[0].affectedLocation.version,
  }));

  return sortByVulnerability(mapped);
};

const matchAndMapVulnerabilities = (occurrences, notes) => {
  const unmatchedOccurrences = [];

  const discoveryOccurrences = occurrences.filter(
    (occurrence) => occurrence.kind === "DISCOVERY"
  );
  const vulnerabilityOccurrences = occurrences.filter(
    (occurrence) => occurrence.kind === "VULNERABILITY"
  );

  const scanStarts = discoveryOccurrences.filter(
    (occurrence) =>
      occurrence.discovered.discovered.analysisStatus === "SCANNING"
  );

  const tfSecScanStarts = scanStarts.filter((scan) =>
    scan.noteName.includes("tfsec")
  );
  const otherScanStarts = scanStarts.filter(
    (scan) => !scan.noteName.includes("tfsec")
  );

  const scanEnds = discoveryOccurrences.filter(
    (occurrence) =>
      occurrence.discovered.discovered.analysisStatus.includes("FINISHED")
  );

  const matchedTfSecScans = tfSecScanStarts
    .map((startScan) => {
      const endScan = scanEnds.find(
        (endScan) =>
          endScan.noteName === startScan.noteName &&
          endScan.createTime === startScan.createTime
      );

      const matchingVulnerabilities = vulnerabilityOccurrences.filter(
        (vulnerability) =>
          vulnerability.noteName === startScan.noteName &&
          vulnerability.createTime === startScan.createTime
      );

      const matchingNotes = notes[startScan.noteName];

      if (!endScan) {
        return {
          name: startScan.name,
          started: startScan.createTime,
          completed: null,
          vulnerabilities: matchingVulnerabilities,
          notes: matchingNotes,
          originals: {
            occurrences: [startScan, ...matchingVulnerabilities],
          },
        };
      }

      return {
        name: startScan.name,
        started: startScan.createTime,
        completed: endScan.createTime,
        vulnerabilities: mapVulnerabilities(matchingVulnerabilities),
        notes: matchingNotes,
        originals: {
          occurrences: [startScan, endScan, ...matchingVulnerabilities],
        },
      };
    })
    .filter((val) => val);

  const matchedOtherScans = otherScanStarts
    .map((startScan) => {
      const noteName = startScan.noteName;

      const matchingVulnerabilities = vulnerabilityOccurrences.filter(
        (vulnerability) => vulnerability.noteName === noteName
      );
      const endScan = scanEnds.find((endScan) => endScan.noteName === noteName);

      const matchingNotes = notes[startScan.noteName];

      if (!endScan) {
        return {
          name: startScan.name,
          started: startScan.createTime,
          completed: null,
          vulnerabilities: matchingVulnerabilities,
          notes: matchingNotes,
          originals: {
            occurrences: [startScan, ...matchingVulnerabilities],
          },
        };
      }

      return {
        name: startScan.name,
        started: startScan.createTime,
        completed: endScan.createTime,
        vulnerabilities: mapVulnerabilities(matchingVulnerabilities),
        notes: matchingNotes,
        originals: {
          occurrences: [startScan, endScan, ...matchingVulnerabilities],
        },
      };
    })
    .filter((val) => val);

  // get unmatched end scans occurrences
  scanEnds.forEach((endScan) => {
    const matchingHarbor = matchedOtherScans.find((occurrence) =>
      occurrence.originals.occurrences.find((occ) => occ.name === endScan.name)
    );
    const matchingTfSec = matchedTfSecScans.find((occurrence) =>
      occurrence.originals.occurrences.find(
        (occ) => occ.createTime === endScan.createTime
      )
    );
    if (!matchingHarbor && !matchingTfSec) {
      unmatchedOccurrences.push(endScan);
    }
  });

  // get unmatched vulnerability occurrences
  vulnerabilityOccurrences.forEach((vulnerability) => {
    const matchingHarbor = matchedOtherScans.find((occurrence) =>
      occurrence.originals.occurrences.find(
        (occ) => occ.name === vulnerability.name
      )
    );
    const matchingTfSec = matchedTfSecScans.find((occurrence) =>
      occurrence.originals.occurrences.find(
        (occ) => occ.createTime === vulnerability.createTime
      )
    );
    if (!matchingHarbor && !matchingTfSec) {
      unmatchedOccurrences.push(vulnerability);
    }
  });

  return {
    vulnerabilities: [...matchedOtherScans, ...matchedTfSecScans],
    other: unmatchedOccurrences,
  };
};

const mapBuilds = (occurrences, resourceUri) => {
  let relatedBuildOccurrences = occurrences;
  const { resourceType } = getResourceDetails(resourceUri);

  if (resourceType !== RESOURCE_TYPES.GIT) {
    relatedBuildOccurrences = occurrences.filter((occurrence) =>
      occurrence.build.provenance.builtArtifacts.some(
        (artifact) => artifact.id === resourceUri
      )
    );
  }

  return relatedBuildOccurrences.map((occ) => {
    return {
      name: occ.name,
      started: occ.build.provenance.startTime,
      completed: occ.build.provenance.endTime,
      creator: occ.build.provenance.creator,
      artifacts: occ.build.provenance.builtArtifacts,
      sourceUri: occ.build.provenance.sourceProvenance.context.git.url,
      logsUri: occ.build.provenance.logsUri,
      originals: { occurrences: [occ] },
    };
  });
};

const mapDeployments = (occurrences) => {
  return occurrences.map((occ) => {
    return {
      name: occ.name,
      deploymentStart: occ.deployment.deployment.deployTime,
      deploymentEnd: occ.deployment.deployment.undeployTime,
      resourceUris: occ.deployment.deployment.resourceUri,
      platform: occ.deployment.deployment.platform,
      originals: { occurrences: [occ] },
    };
  });
};

export const mapOccurrencesToSections = (occurrences, resourceUri, notes) => {
  let buildOccurrences = [];
  let vulnerabilityOccurrences = [];
  let deploymentOccurrences = [];
  let otherOccurrences = [];

  occurrences.forEach((occurrence) => {
    switch (occurrence.kind) {
      case "BUILD": {
        buildOccurrences.push(occurrence);
        break;
      }
      case "DISCOVERY": {
        vulnerabilityOccurrences.push(occurrence);
        break;
      }
      case "VULNERABILITY": {
        vulnerabilityOccurrences.push(occurrence);
        break;
      }
      case "DEPLOYMENT": {
        deploymentOccurrences.push(occurrence);
        break;
      }
      default: {
        otherOccurrences.push(occurrence);
        break;
      }
    }
  });

  const { vulnerabilities, other } = matchAndMapVulnerabilities(
    vulnerabilityOccurrences,
    notes
  );

  return {
    build: mapBuilds(buildOccurrences, resourceUri),
    secure: vulnerabilities,
    deploy: mapDeployments(deploymentOccurrences),
    other: [...other, ...otherOccurrences],
    originals: { occurrences },
  };
};
