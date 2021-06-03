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

import React from "react";
import PropTypes from "prop-types";
import BuildOccurrenceSection from "components/occurrences/BuildOccurrenceSection";
import SecureOccurrenceSection from "components/occurrences/SecureOccurrenceSection";
import DeploymentOccurrenceSection from "components/occurrences/DeploymentOccurrenceSection";
import OtherOccurrenceSection from "components/occurrences/OtherOccurrenceSection";
import { useResources } from "providers/resources";
import { getResourceDetails } from "utils/resource-utils";
import { mapOccurrencesToSections } from "pages/api/utils/occurrence-utils";
import styles from "styles/modules/Occurrences.module.scss";
import ResourceVersion from "components/resources/ResourceVersion";
import LabelWithValue from "components/LabelWithValue";

const GitResourceOccurrences = (props) => {
  const { occurrences } = props;
  const { state } = useResources();

  const uniqueUris = Array.from(
    new Set(occurrences?.originals?.occurrences.map((occ) => occ.resource.uri))
  );
  const uniqueNonGitUris = uniqueUris.filter(
    (uri) => uri !== state.currentResource.uri
  );

  const matchedNonGitOccurrences = uniqueNonGitUris.map((uri) => {
    return occurrences?.originals?.occurrences.filter(
      (occ) => occ.resource.uri === uri
    );
  });

  const gitBuildOccurrences = occurrences?.originals?.occurrences.filter(
    (occ) =>
      occ.resource.uri === state.currentResource.uri && occ.kind === "BUILD"
  );
  const otherGitOccurrences = occurrences?.originals?.occurrences.filter(
    (occ) =>
      occ.resource.uri === state.currentResource.uri && occ.kind !== "BUILD"
  );

  const matchedWithBuilds = gitBuildOccurrences.map((build) => {
    const artifactIds = build.build.provenance.builtArtifacts.map(
      (artifact) => artifact.id
    );

    const matchingGroup = matchedNonGitOccurrences.filter((occurrenceGroup) =>
      artifactIds.includes(occurrenceGroup[0].resource.uri)
    );

    return [build, ...matchingGroup.flat()];
  });

  const mappedGroupedOccurrences = matchedWithBuilds.map((occs) =>
    mapOccurrencesToSections(occs, state.currentResource.uri)
  );

  const mappedOccurrences = [
    ...mappedGroupedOccurrences,
    mapOccurrencesToSections(otherGitOccurrences, state.currentResource.uri),
  ];

  return (
    <>
      {mappedOccurrences.map((occGroup) => {
        let version = null;
        if (occGroup.build.length > 0) {
          [version] = occGroup.build[0].artifacts.map((artifact) => {
            const { resourceVersion } = getResourceDetails(artifact.id);
            return resourceVersion;
          });
        }

        let key = null;
        if (occGroup.build.length > 0) {
          key = occGroup.build[0].name;
        } else if (occGroup.secure.length > 0) {
          key = occGroup.secure[0].name;
        }

        return (
          <div key={key} className={styles.occurrenceSection}>
            {occGroup.build.length > 0 && (
              <LabelWithValue
                className={styles.occurrenceSectionHeader}
                label={"Artifact"}
                value={<ResourceVersion version={version} copy />}
              />
            )}
            {!occGroup.build.length &&
              (occGroup.secure.length > 0 ||
                occGroup.deploy.length > 0 ||
                occGroup.other.length > 0) && (
                <p className={styles.occurrenceSectionHeader}>
                  Git Occurrences
                </p>
              )}
            <BuildOccurrenceSection occurrences={occGroup.build} />
            <SecureOccurrenceSection occurrences={occGroup.secure} />
            <DeploymentOccurrenceSection occurrences={occGroup.deploy} />
            <OtherOccurrenceSection occurrences={occGroup.other} />
          </div>
        );
      })}
    </>
  );
};

GitResourceOccurrences.propTypes = {
  occurrences: PropTypes.object.isRequired,
};

export default GitResourceOccurrences;
