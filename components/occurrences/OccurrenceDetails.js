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
import OccurrenceCodeBlock from "./OccurrenceCodeBlock";
import styles from "styles/modules/Occurrences.module.scss";
import BuildOccurrenceDetails from "./BuildOccurrenceDetails";
import VulnerabilityOccurrenceDetails from "./VulnerabilityOccurrenceDetails";
import DeploymentOccurrenceDetails from "./DeploymentOccurrenceDetails";

const detailComponentMap = {
  BUILD: BuildOccurrenceDetails,
  VULNERABILITY: VulnerabilityOccurrenceDetails,
  DISCOVERY: VulnerabilityOccurrenceDetails,
  DEPLOYMENT: DeploymentOccurrenceDetails,
};

const OccurrenceDetails = ({ occurrence }) => {
  const DetailComponent = detailComponentMap[occurrence.originals[0].kind];

  return (
    <div className={styles.detailContainer} data-testid={'occurrenceDetails'}>
      <DetailComponent occurrence={occurrence} />
      <OccurrenceCodeBlock occurrence={occurrence} />
    </div>
  );
};

OccurrenceDetails.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default OccurrenceDetails;
