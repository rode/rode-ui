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

import Chance from "chance";

const chance = new Chance();

const createDiscoveryOccurrence = () => ({
  discovered: {
    discovered: {
      continuousAnalysis: "CONTINUOUS_ANALYSIS_UNSPECIFIED",
      lastAnalysisTime: null,
      analysisStatus: chance.pickone([
        "SCANNING",
        "FINISHED_SUCCESS",
        "FINISHED_FAILURE",
      ]),
      analysisStatusError: null,
    },
  },
});
const createVulnerabilityOccurrence = () => ({
  vulnerability: {
    type: "docker",
    severity: "SEVERITY_UNSPECIFIED",
    cvssScore: 0,
    packageIssue: [
      {
        affectedLocation: {
          cpeUri: chance.url(),
          package: chance.word({ syllables: chance.d6() }),
          version: {
            epoch: 0,
            name: "curl",
            revision: "",
            kind: "NORMAL",
          },
        },
        fixedLocation: null,
        severityName: "",
      },
    ],
    shortDescription: chance.sentence(),
    longDescription: "",
    relatedUrls: chance.n(() => ({
      url: chance.url(),
      label: "",
    })),
    effectiveSeverity: chance.pickone(["HIGH", "MEDIUM", "LOW"]),
  },
});

const createBuildOccurrence = () => ({
  build: {
    provenance: {
      id: chance.guid(),
      projectId: chance.string(),
      commands: [],
      builtArtifacts: [
        {
          checksum: chance.natural(),
          id: chance.guid(),
          names: [chance.word({ syllable: chance.d10() })],
        },
      ],
      createTime: chance.timestamp(),
      startTime: chance.timestamp(),
      endTime: chance.timestamp(),
      creator: chance.email(),
      logsUri: chance.url(),
      sourceProvenance: {
        artifactStorageSourceUri: "input binary artifacts from this build",
        context: {
          git: {
            url: chance.url(),
            revisionId: chance.hash(),
          },
          labels: {},
        },
      },
      triggerId: chance.hash(),
      builderVersion: chance.semver(),
    },
    provenanceBytes: chance.string(),
  },
});

const mockOccurrenceMap = {
  DISCOVERY: createDiscoveryOccurrence,
  VULNERABILITY: createVulnerabilityOccurrence,
  BUILD: createBuildOccurrence,
};

export const createMockOccurrence = (
  kind = chance.pickone(Object.keys(mockOccurrenceMap))
) => {
  const kindSpecificDetails = mockOccurrenceMap[kind]();

  return {
    name: `projects/rode/occurrences/${chance.guid()}`,
    resource: {
      name: "",
      uri: createMockResourceUri(),
      contentHash: null,
    },
    noteName: "projects/rode/notes/harbor",
    kind: kind,
    remediation: "",
    createTime: chance.timestamp(),
    updateTime: null,
    ...kindSpecificDetails,
  };
};

export const createMockResourceUri = (
  name = chance.word({ syllables: 3 }),
  version = chance.natural()
) => {
  return `${chance.url()}/${name}@sha256:${version}`;
};
