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

import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "components/Button";
import styles from "styles/modules/Playground.module.scss";
import ResourceVersion from "components/resources/ResourceVersion";

const SelectedResource = (props) => {
  const { resource, clearResource } = props;

  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => setShowDetails(!showDetails);
  return (
    <div className={styles.selectionContainer}>
      <h2 className={styles.selectionTitle}>
        Selected Resource
        <span className={styles.selectionName}>{resource.name}</span>
      </h2>
      <div className={styles.selectionButtonContainer}>
        <Button
          buttonType={"text"}
          label={
            showDetails ? "Hide Resource Details" : "Show Resource Details"
          }
          onClick={toggleDetails}
        />
        <Button
          buttonType={"textDestructive"}
          label={"Clear Resource"}
          onClick={clearResource}
        />
      </div>
      {showDetails && (
        <div className={styles.selectionDetailsContainer}>
          <p className={styles.selectionDetails}>
            <span className={styles.label}>Version</span>
            <ResourceVersion
              version={resource.version}
              copy={true}
              buttonClassName={styles.copyVersionButton}
            />
          </p>
          <p className={styles.selectionDetails}>
            <span className={styles.label}>Type</span>
            <span className={styles.break}>{resource.type}</span>
          </p>
        </div>
      )}
    </div>
  );
};

SelectedResource.propTypes = {
  resource: PropTypes.object.isRequired,
  clearResource: PropTypes.func.isRequired,
};

export default SelectedResource;
