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
import Button from "components/Button";
import styles from "styles/modules/Playground.module.scss";

const SelectedResource = (props) => {
  const { resource, clearResource } = props;

  return (
    <div className={styles.selectionContainer}>
      <h2 className={styles.selectionTitle}>Selected Resource</h2>
      <p className={styles.selectionDetails}>
        <span className={styles.label}>Name</span>
        <span>{resource.name}</span>
      </p>
      <p className={styles.selectionDetails}>
        <span className={styles.label}>Version</span>
        <span className={styles.break}>{resource.version}</span>
      </p>
      <p className={styles.selectionDetails}>
        <span className={styles.label}>Type</span>
        <span className={styles.break}>{resource.type}</span>
      </p>
      <Button
        buttonType={"textDestructive"}
        label={"Clear Resource"}
        onClick={clearResource}
      />
    </div>
  );
};

SelectedResource.propTypes = {
  resource: PropTypes.object.isRequired,
  clearResource: PropTypes.func.isRequired,
};

export default SelectedResource;
