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

const DeploymentOccurrenceDetails = ({ occurrence }) => {
  return (
    <div>
      <div className={styles.detailSummary}>
        <div>
          <p className={styles.title}>Deployment</p>
          <p>Deployed to {occurrence.platform}</p>
        </div>
        <div className={styles.timestamps}>
          <p>
            Started {dayjs(occurrence.deploymentStart).format(DATE_TIME_FORMAT)}
          </p>
          <p>
            Deployment End{" "}
            {dayjs(occurrence.deploymentEnd).format(DATE_TIME_FORMAT)}
          </p>
        </div>
      </div>
      <div className={styles.detailContentContainer}>
        <p>Resources Deployed: {occurrence.resourceUris.join(", ")}</p>
      </div>
    </div>
  );
};

DeploymentOccurrenceDetails.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default DeploymentOccurrenceDetails;
