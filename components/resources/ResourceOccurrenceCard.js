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
import styles from "styles/modules/Occurrences.module.scss";
import { useTheme } from "hooks/useTheme";
import dayjs from "dayjs";
import DiscoveryOccurrencePreview from "components/occurrences/DiscoveryOccurrencePreview";
import VulnerabilityOccurrencePreview from "components/occurrences/VulnerabilityOccurrencePreview";
import BuildOccurrencePreview from "components/occurrences/BuildOccurrencePreview";
import OccurrenceCodeBlock from "components/occurrences/OccurrenceCodeBlock";

const occurrenceMap = {
  ["DISCOVERY"]: DiscoveryOccurrencePreview,
  ["VULNERABILITY"]: VulnerabilityOccurrencePreview,
  ["BUILD"]: BuildOccurrencePreview,
};

const ResourceOccurrenceCard = ({ occurrence }) => {
  const { theme } = useTheme();
  const OccurrenceDetails = occurrenceMap[occurrence.kind];

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <div>
        <p className={styles.kind}>{occurrence.kind}</p>

        <p className={styles.createdAt}>
          {`Created at ${dayjs(occurrence.createTime).format(
            "h:mm:ssa | MM-DD-YYYY"
          )}`}
        </p>
        {OccurrenceDetails && <OccurrenceDetails occurrence={occurrence} />}
      </div>
      <OccurrenceCodeBlock occurrence={occurrence} />
    </div>
  );
};

ResourceOccurrenceCard.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default ResourceOccurrenceCard;
