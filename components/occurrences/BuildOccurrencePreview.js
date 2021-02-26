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

import styles from "styles/modules/Occurrences.module.scss";
import PropTypes from "prop-types";
import React from "react";
import dayjs from "dayjs";

const DATE_TIME_FORMAT = "h:mm:ssa | MM-DD-YYYY";

const BuildOccurrencePreview = ({ occurrence }) => {
  return (
    <div className={styles.discovery}>
      <p>Build Id: {occurrence.build.provenance.id}</p>
      <p>Project Id: {occurrence.build.provenance.projectId}</p>
      {occurrence.build.provenance.builtArtifacts.length > 0 &&
        occurrence.build.provenance.builtArtifacts.map((artifact) => (
          <div key={artifact.checksum}>
            <p>Checksum: {artifact.checksum}</p>
            <p>Artifact Id: {artifact.id}</p>
            <p>Names: {artifact.names.join(",")}</p>
          </div>
        ))}
      <p>
        Create Time:{" "}
        {dayjs(occurrence.build.provenance.createTime).format(DATE_TIME_FORMAT)}
      </p>
      <p>
        Start Time:{" "}
        {dayjs(occurrence.build.provenance.startTime).format(DATE_TIME_FORMAT)}
      </p>
      <p>
        End Time:{" "}
        {dayjs(occurrence.build.provenance.endTime).format(DATE_TIME_FORMAT)}
      </p>
      <p>Creator: {occurrence.build.provenance.creator}</p>
      <p>Logs: {occurrence.build.provenance.logsUri}</p>
      <p>
        Source Provenance Artifact Storage Source Uri:{" "}
        {occurrence.build.provenance.sourceProvenance.artifactStorageSourceUri}
      </p>
      <p>
        Git URL:{" "}
        <a href={occurrence.build.provenance.sourceProvenance.context.git.url}>
          {occurrence.build.provenance.sourceProvenance.context.git.url}
        </a>
      </p>
      <p>
        Git Commit Hash:{" "}
        {occurrence.build.provenance.sourceProvenance.context.git.revisionId}
      </p>
      <p>Triggered by code commit: {occurrence.build.provenance.triggerId}</p>
      <p>Builder Version: {occurrence.build.provenance.builderVersion}</p>
      <p>Provenance Bytes: {occurrence.provenanceBytes}</p>
    </div>
  );
};
BuildOccurrencePreview.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default BuildOccurrencePreview;
