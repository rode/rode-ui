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

const SelectedResource = (props) => {
  const { resourceUri } = props;

  const { data, loading } = useFetch(resourceUri ? `/api/occurrences` : null, {
    resourceUri: resourceUri,
  });

  return (
    <>
      <p className={textStyles.label}>Occurrence Data</p>
      {resourceUri ? (
        <Loading loading={loading}>
          <Code
            code={JSON.stringify(data?.originals, null, 2)}
            language={"json"}
            className={styles.codeContent}
            data-testid={"occurrenceJson"}
          />
        </Loading>
      ) : (
        <p className={styles.selectToBeginText}>Select a resource to begin</p>
      )}
    </>
  );
};

SelectedResource.propTypes = {
  resourceUri: PropTypes.string,
};

export default SelectedResource;
