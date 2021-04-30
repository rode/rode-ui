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
import OccurrencePreview from "components/occurrences/OccurrencePreview";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { getVulnerabilityBreakdown } from "utils/occurrence-utils";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "utils/constants";

const SecureOccurrenceSection = ({ occurrences }) => {
  if (!occurrences?.length) {
    return null;
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionTitle}>
        <Icon name={ICON_NAMES.SHIELD_CHECK} />
        <p>Secure</p>
      </div>
      {occurrences.map((occurrence) => (
        <OccurrencePreview
          key={occurrence.name}
          currentOccurrence={occurrence}
          mainText={"Vulnerability Scan"}
          timestamp={
            occurrence.completed
              ? `Completed at ${dayjs(occurrence.completed).format(
                  DATE_TIME_FORMAT
                )}`
              : "In Progress"
          }
          subText={
            occurrence.completed ? (
              <>
                <span>{`${occurrence.vulnerabilities.length} vulnerabilities found`}</span>
                {!!occurrence.vulnerabilities.length && (
                  <span
                    className={styles.previewBreakdown}
                  >{`${getVulnerabilityBreakdown(
                    occurrence.vulnerabilities
                  )}`}</span>
                )}
              </>
            ) : null
          }
        />
      ))}
    </div>
  );
};
SecureOccurrenceSection.propTypes = {
  occurrences: PropTypes.array,
};

export default SecureOccurrenceSection;
