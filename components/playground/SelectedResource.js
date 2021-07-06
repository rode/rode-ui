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
import styles from "styles/modules/Playground.module.scss";
import Code from "components/Code";
import { useFetch } from "hooks/useFetch";
import Loading from "components/Loading";
import { getResourceDetails } from "utils/resource-utils";
import LabelWithValue from "components/LabelWithValue";
import ResourceVersion from "components/resources/ResourceVersion";
import Button from "components/Button";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import ResourceSelectionDrawer from "components/playground/ResourceSelectionDrawer";
import { copy } from "utils/shared-utils";
import Text from "components/Text";

const SelectedResource = (props) => {
  const { resourceUri, setEvaluationResource, clearEvaluation } = props;

  const { data, loading } = useFetch(resourceUri ? `/api/occurrences` : null, {
    resourceUri: resourceUri,
  });

  const { resourceName, resourceVersion } = getResourceDetails(resourceUri);

  const formattedOccurrenceData = JSON.stringify(data?.originals, null, 2);

  return (
    <>
      <div className={styles.selectionHeader}>
        {resourceUri && (
          <div className={styles.selectionDetailsContainer}>
            <LabelWithValue label={"Resource"} value={resourceName} />
            <LabelWithValue
              label={"Version"}
              value={<ResourceVersion version={resourceVersion} />}
            />
          </div>
        )}
        <div className={styles.buttonContainer}>
          {resourceUri && (
            <>
              <Button
                label={"Clear Resource"}
                buttonType={"icon"}
                onClick={() => {
                  setEvaluationResource(null);
                  clearEvaluation();
                }}
                showTooltip
              >
                <Icon name={ICON_NAMES.BAN} />
              </Button>
              <Button
                label={"Copy Occurrence Data"}
                buttonType={"icon"}
                onClick={() => copy(formattedOccurrenceData)}
                showTooltip
              >
                <Icon name={ICON_NAMES.CLIPBOARD_COPY} />
              </Button>
            </>
          )}
          <ResourceSelectionDrawer
            setEvaluationResource={setEvaluationResource}
            clearEvaluation={clearEvaluation}
          />
        </div>
      </div>
      {resourceUri ? (
        <Loading loading={loading}>
          <Text.Label as={"p"}>Occurrence Data</Text.Label>
          <Code
            code={formattedOccurrenceData}
            language={"json"}
            className={styles.codeContent}
            data-testid={"occurrenceJson"}
          />
        </Loading>
      ) : (
        <Text.Body1 className={styles.selectToBeginText}>
          Search for a resource to begin
        </Text.Body1>
      )}
    </>
  );
};

SelectedResource.propTypes = {
  resourceUri: PropTypes.string,
  setEvaluationResource: PropTypes.func.isRequired,
  clearEvaluation: PropTypes.func.isRequired,
};

export default SelectedResource;
