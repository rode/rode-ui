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
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "utils/constants";
import OccurrenceCodeBlock from "./OccurrenceCodeBlock";

const OtherOccurrenceSection = ({ occurrences }) => {
  if (!occurrences?.length) {
    return null;
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionTitle}>
        <Icon name={ICON_NAMES.FLAG} />
        <p>Other</p>
      </div>
      {occurrences.map((occurrence) => (
        <div className={styles.unknownPreviewContainer} key={occurrence.name}>
          <p className={styles.previewMainText}>{occurrence.kind}</p>
          {occurrence.createTime && (
            <p className={styles.previewTimestamp}>{`Created at ${dayjs(
              occurrence.createTime
            ).format(DATE_TIME_FORMAT)}`}</p>
          )}
          <OccurrenceCodeBlock json={occurrence} fullWidth={true} />
        </div>
      ))}
    </div>
  );
};
OtherOccurrenceSection.propTypes = {
  occurrences: PropTypes.array,
};

export default OtherOccurrenceSection;
