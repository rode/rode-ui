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

dayjs.extend(isSameOrAfter);

const mapVulnerabilities = (occurrences) => {
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

  return scanStarts.map((scan) => {
    const startTime = dayjs(scan.createTime);
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

    return {
      name: scan.name,
      started: startTime,
      completed: matchingScanEndOccurrence.createTime,
      vulnerabilities: vulnerabilityOccurrences.filter(
        (vuln) =>
          vuln.kind === "VULNERABILITY" &&
          vuln.createTime === matchingScanEndOccurrence.createTime
      ),
    };
  });
};

const mapBuilds = (occurrences) => {
  return occurrences.map((occ) => {
    return {
      name: occ.name,
      started: occ.build.provenance.startTime,
      completed: occ.build.provenance.endTime,
      creator: occ.build.provenance.creator,
      artifacts: occ.build.provenance.builtArtifacts,
      sourceUri: `${occ.build.provenance.sourceProvenance.context.git.url}/tree/${occ.build.provenance.sourceProvenance.context.git.revisionId}`,
      logsUri: occ.build.provenance.logsUri,
    };
  });
};

const mapDeployments = (occurrences) => {
  return occurrences;
};

export const mapOccurrencesToSections = (occurrences) => {
  let buildOccurrences = [];
  let vulnerabilityOccurrences = [];
  let deploymentOccurrences = [];
  let attestationOccurrences = [];

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
      case "ATTESTATION": {
        attestationOccurrences.push(occurrence);
        break;
      }
    }
  });

  return {
    build: {
      original: buildOccurrences,
      mapped: mapBuilds(buildOccurrences),
    },
    secure: {
      original: vulnerabilityOccurrences,
      mapped: mapVulnerabilities(vulnerabilityOccurrences),
    },
    deploy: {
      original: deploymentOccurrences,
      mapped: mapDeployments(deploymentOccurrences),
    },
    attestation: attestationOccurrences,
  };
};
