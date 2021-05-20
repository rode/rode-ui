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
import { getResourceDetails } from "utils/resource-utils";

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

const matchAndMapVulnerabilities = (occurrences) => {
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
  const completedScans = discoveryOccurrences.filter(
    (occurrence) =>
      occurrence.discovered.discovered.analysisStatus === "FINISHED_SUCCESS"
  );

  const matchedOccurrences = scanStarts
    .map((startScan) => {
      const startTime = dayjs(startScan.createTime);
      // get all scans that end after the start time
      const possibleScanEnds = completedScans.filter((occurrence) =>
        dayjs(occurrence.createTime).isSameOrAfter(startTime)
      );
      // pick the scan that ended closest to the start time
      const scanEndTimes = possibleScanEnds.map((scan) =>
        dayjs(scan.createTime).valueOf()
      );
      const closestEndTime = Math.min(...scanEndTimes);
      const matchingScanEndOccurrence = possibleScanEnds.find(
        (scan) => dayjs(scan.createTime).valueOf() === closestEndTime
      );

      if (!matchingScanEndOccurrence) {
        // if no end scan is found, return as "In Progress"
        return {
          name: startScan.name,
          started: startScan.createTime,
          completed: null,
          vulnerabilities: [],
          originals: {
            occurrences: [startScan],
          },
        };
      }

      // get vulnerabilities with the same createTime as the end scan occurrence
      const matchingVulnerabilityOccurrences = vulnerabilityOccurrences.filter(
        (vuln) =>
          vuln.kind === "VULNERABILITY" &&
          vuln.createTime === matchingScanEndOccurrence?.createTime
      );

      return {
        name: startScan.name,
        started: startScan.createTime,
        completed: matchingScanEndOccurrence.createTime,
        vulnerabilities: mapVulnerabilities(matchingVulnerabilityOccurrences),
        originals: {
          occurrences: [
            startScan,
            matchingScanEndOccurrence,
            ...matchingVulnerabilityOccurrences,
          ],
        },
      };
    })
    .filter((val) => val);

  // get unmatched end scans occurrences
  completedScans.forEach((endScan) => {
    const matchingScan = matchedOccurrences.find((occurrence) =>
      occurrence.originals.occurrences.find((occ) => occ.name === endScan.name)
    );
    if (!matchingScan) {
      unmatchedOccurrences.push(endScan);
    }
  });

  vulnerabilityOccurrences.forEach((vulnerability) => {
    const matchingScan = matchedOccurrences.find((occurrence) =>
      occurrence.originals.occurrences.find(
        (occ) => occ.name === vulnerability.name
      )
    );
    if (!matchingScan) {
      unmatchedOccurrences.push(vulnerability);
    }
  });

  return {
    vulnerabilities: matchedOccurrences,
    other: unmatchedOccurrences,
  };
};

const mapBuilds = (occurrences, resourceUri) => {
  let relatedBuildOccurrences = occurrences;
  const { resourceType } = getResourceDetails(resourceUri);

  if (resourceType !== "Git") {
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

export const mapOccurrencesToSections = (occurrences, resourceUri) => {
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
    vulnerabilityOccurrences
  );

  return {
    build: mapBuilds(buildOccurrences, resourceUri),
    secure: vulnerabilities,
    deploy: mapDeployments(deploymentOccurrences),
    other: [...other, ...otherOccurrences],
    originals: { occurrences },
  };
};
