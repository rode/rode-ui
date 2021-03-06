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
import OccurrenceCodeModal from "./OccurrenceCodeModal";
import LabelWithValue from "components/LabelWithValue";
import Text from "components/Text";

const DeploymentOccurrenceDetails = ({ occurrence }) => {
  return (
    <div>
      <div className={styles.detailSummary}>
        <div>
          <Text.Body1>Deployed to {occurrence.platform}</Text.Body1>
        </div>
        <div className={styles.rightDetails}>
          <Text.Body2 className={styles.timestamps}>
            Started {dayjs(occurrence.deploymentStart).format(DATE_TIME_FORMAT)}
          </Text.Body2>
          <Text.Body2 className={styles.timestamps}>
            Deployment End{" "}
            {dayjs(occurrence.deploymentEnd).format(DATE_TIME_FORMAT)}
          </Text.Body2>

          <OccurrenceCodeModal json={occurrence.originals} />
        </div>
      </div>
      <div className={styles.detailContentContainer}>
        <LabelWithValue
          label={"Resources Deployed"}
          value={occurrence.resourceUris.join(", ")}
        />
      </div>
    </div>
  );
};

DeploymentOccurrenceDetails.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default DeploymentOccurrenceDetails;
