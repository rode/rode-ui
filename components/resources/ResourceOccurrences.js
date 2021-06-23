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
import BuildOccurrenceSection from "components/occurrences/BuildOccurrenceSection";
import SecureOccurrenceSection from "components/occurrences/SecureOccurrenceSection";
import DeploymentOccurrenceSection from "components/occurrences/DeploymentOccurrenceSection";
import OccurrenceDetails from "components/occurrences/OccurrenceDetails";
import OtherOccurrenceSection from "components/occurrences/OtherOccurrenceSection";
import styles from "styles/modules/Occurrences.module.scss";
import { useTheme } from "providers/theme";
import { usePolicies } from "providers/appState";

const ResourceOccurrences = (props) => {
  const { occurrences } = props;
  const { state } = usePolicies();
  const { theme } = useTheme();

  return (
    <div className={`${styles.layout} ${styles[theme]}`}>
      <div className={styles.occurrencePreviewsContainer}>
        <BuildOccurrenceSection
          occurrences={occurrences.build}
          type={state.currentResource?.resourceType}
        />
        <SecureOccurrenceSection occurrences={occurrences.secure} />
        <DeploymentOccurrenceSection occurrences={occurrences.deploy} />
        <OtherOccurrenceSection occurrences={occurrences.other} />
      </div>
      {state.occurrenceDetails && (
        <div className={styles.occurrenceDetailsContainer}>
          <OccurrenceDetails occurrence={state.occurrenceDetails} />
        </div>
      )}
    </div>
  );
};

ResourceOccurrences.propTypes = {
  occurrences: PropTypes.object.isRequired,
};

export default ResourceOccurrences;
