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
import styles from "styles/modules/OccurrenceDetails.module.scss";
import { DATE_TIME_FORMAT } from "utils/constants";
import dayjs from "dayjs";
import ExternalLink from "components/ExternalLink";
import OccurrenceCodeModal from "./OccurrenceCodeModal";
import LabelWithValue from "components/LabelWithValue";
import Link from "next/link";

// TODO: ask about build artifacts - the only built artifact should be the resource being shown, correct?
// Should the "View Git Resource" link live in the build artifact card if that is the case?

const BuildOccurrenceDetails = ({ occurrence, resource }) => {
  const occurrenceResourceUri =
    occurrence.originals.occurrences[0].resource.uri;

  const resourceConnectsToGitOccurrence =
    resource.resourceType !== "Git" && occurrenceResourceUri !== resource.uri;

  return (
    <div>
      <div className={styles.detailSummary}>
        <div>
          <p className={styles.title}>Build</p>
          <ExternalLink
            href={occurrence.sourceUri}
            label={"View source"}
            className={styles.rightMargin}
            fallback={<p className={styles.subtext}>Source not available</p>}
          />
          <ExternalLink
            href={occurrence.logsUri}
            label={"View logs"}
            fallback={<p className={styles.subtext}>Logs not available</p>}
          />
          <LabelWithValue label={"Created By"} value={occurrence.creator} />
          {resourceConnectsToGitOccurrence && (
            <Link
              href={`/resources/${encodeURIComponent(occurrenceResourceUri)}`}
            >
              <a>View Git Resource</a>
            </Link>
          )}
        </div>
        <div className={styles.rightDetails}>
          <p className={styles.timestamps}>
            Started {dayjs(occurrence.started).format(DATE_TIME_FORMAT)}
          </p>
          <p className={styles.timestamps}>
            Completed {dayjs(occurrence.completed).format(DATE_TIME_FORMAT)}
          </p>
          <OccurrenceCodeModal json={occurrence.originals} />
        </div>
      </div>
      <div className={styles.detailContentContainer}>
        {occurrence.artifacts?.map((artifact) => (
          <div key={artifact.id} className={styles.card}>
            <p className={styles.cardTitle}>Build Artifact</p>
            <p>{artifact.id}</p>
            <LabelWithValue
              label={"Related Artifact(s)"}
              value={artifact.names.join(", ")}
              className={styles.buildArtifactDetails}
            />
            <LabelWithValue
              label={"Checksum"}
              value={artifact.checksum}
              className={styles.buildArtifactDetails}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

BuildOccurrenceDetails.propTypes = {
  occurrence: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
};

export default BuildOccurrenceDetails;
