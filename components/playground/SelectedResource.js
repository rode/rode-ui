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
import LabelWithValue from "components/LabelWithValue";
import Code from "components/Code";
import { useFetch } from "hooks/useFetch";
import typeStyles from "styles/modules/Typography.module.scss";
import Loading from "components/Loading";

const SelectedResource = (props) => {
  const { resource, clearResource } = props;

  const [showDetails, setShowDetails] = useState(false);
  const toggleDetails = () => setShowDetails(!showDetails);

  const { data, loading } = useFetch(`/api/occurrences`, {
    resourceUri: resource.uri,
  });

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
          <LabelWithValue
            label={"Version"}
            value={
              <ResourceVersion
                version={resource.version}
                copy={true}
                buttonClassName={styles.copyVersionButton}
              />
            }
            className={styles.selectionDetails}
          />
          <LabelWithValue
            label={"Type"}
            value={resource.type}
            className={styles.selectionDetails}
          />
          <Loading loading={loading}>
            <p className={styles.selectionDetails}>
              <span className={typeStyles.label}>Occurrence Data</span>
            </p>
            <Code
              code={JSON.stringify(data?.originals, null, 2)}
              language={"json"}
              className={styles.codeContent}
            />
          </Loading>
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
