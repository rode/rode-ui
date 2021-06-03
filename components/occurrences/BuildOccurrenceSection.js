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
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";
import ExternalLink from "components/ExternalLink";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "utils/constants";

const BuildOccurrenceSection = ({ occurrences }) => {
  if (!occurrences?.length) {
    return null;
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionTitle}>
        <Icon name={ICON_NAMES.COG} />
        <p>Build</p>
      </div>
      {occurrences.map((occurrence) => {
        return (
          <OccurrencePreview
            key={occurrence.name}
            currentOccurrence={occurrence}
            mainText={`Produced ${occurrence.artifacts.length} Artifact${
              occurrence.artifacts.length > 1 ? "s" : ""
            } `}
            timestamp={`Completed at ${dayjs(occurrence.completed).format(
              DATE_TIME_FORMAT
            )}`}
            subText={
              <>
                <ExternalLink
                  href={occurrence.sourceUri}
                  label={"View source"}
                  className={styles.rightMargin}
                />
                <ExternalLink href={occurrence.logsUri} label={"View logs"} />
              </>
            }
          />
        );
      })}
    </div>
  );
};
BuildOccurrenceSection.propTypes = {
  occurrences: PropTypes.array,
};

export default BuildOccurrenceSection;
