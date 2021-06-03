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
import textStyles from "styles/modules/Typography.module.scss";
import Loading from "components/Loading";
import { getResourceDetails } from "utils/resource-utils";
import LabelWithValue from "components/LabelWithValue";
import ResourceVersion from "components/resources/ResourceVersion";
import Button from "components/Button";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { policyActions } from "../../reducers/policies";
import ResourceSelectionDrawer from "./ResourceSelectionDrawer";
import { copy } from "../../utils/shared-utils";

const SelectedResource = (props) => {
  const { resourceUri, setResource, clearEvaluation } = props;

  const { data, loading } = useFetch(resourceUri ? `/api/occurrences` : null, {
    resourceUri: resourceUri,
  });

  const { resourceName, resourceVersion } = getResourceDetails(resourceUri);

  const formattedOccurrenceData = JSON.stringify(data?.originals, null, 2)

  return (
    <>
      <div className={styles.buttonContainer}>
      {resourceUri && (
        <>
          <Button label={"Clear Resource"} buttonType={"icon"}>
            <Icon name={ICON_NAMES.X_CIRCLE} size={"large"}/>
          </Button>
          <Button label={"Copy Occurrence Data"} buttonType={"icon"} onClick={() => copy(formattedOccurrenceData)}>
            <Icon name={ICON_NAMES.CLIPBOARD_COPY} size={"large"}/>
          </Button>
        </>
      )}
      <ResourceSelectionDrawer
        setResource={setResource}
        clearEvaluation={clearEvaluation}
      />
      </div>
      {resourceUri ? (
        <Loading loading={loading}>
          <LabelWithValue label={"Resource"} value={resourceName} />
          <LabelWithValue
            label={"Version"}
            value={<ResourceVersion version={resourceVersion} />}
          />
          <p className={textStyles.label}>Occurrence Data</p>
          <Code
            code={formattedOccurrenceData}
            language={"json"}
            className={styles.codeContent}
            data-testid={"occurrenceJson"}
          />
        </Loading>
      ) : (
        <p className={styles.selectToBeginText}>
          Search for a resource to begin
        </p>
      )}
    </>
  );
};

SelectedResource.propTypes = {
  resourceUri: PropTypes.string,
};

export default SelectedResource;
