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

const mockOccurrenceMap = {
  DISCOVERY: createDiscoveryOccurrence,
  VULNERABILITY: createVulnerabilityOccurrence,
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
