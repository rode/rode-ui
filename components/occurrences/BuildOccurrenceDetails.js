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

const BuildOccurrenceDetails = ({ occurrence }) => {
  return (
    <div>
      <div className={styles.detailSummary}>
        <div>
          <p className={styles.title}>Build</p>
          <ExternalLink href={occurrence.sourceUri} label={"View source"} />
          <ExternalLink href={occurrence.logsUri} label={"View logs"} />
          <p>Created by {occurrence.creator}</p>
        </div>
        <div className={styles.timestamps}>
          <p>Started {dayjs(occurrence.started).format(DATE_TIME_FORMAT)}</p>
          <p>
            Completed {dayjs(occurrence.completed).format(DATE_TIME_FORMAT)}
          </p>
        </div>
      </div>
      <div className={styles.detailContentContainer}>
        {occurrence.artifacts?.map((artifact) => (
          <div key={artifact.id} className={styles.card}>
            <p className={styles.cardTitle}>Build Artifact</p>
            <p>{artifact.names.join(", ")}</p>
            <p>{artifact.id}</p>
            <p>{artifact.checksum}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

BuildOccurrenceDetails.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default BuildOccurrenceDetails;
