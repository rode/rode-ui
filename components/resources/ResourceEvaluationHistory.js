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
import styles from "styles/modules/ResourceEvaluationHistory.module.scss";
import { useTheme } from "providers/theme";
import { useAppState } from "providers/appState";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import Loading from "../Loading";

const ResourceEvaluationHistory = (props) => {
  const { resourceUri } = props;
  const { state } = useAppState();
  const { theme } = useTheme();

  console.log('resourceUri', resourceUri);
  const {data, loading, isLastPage, goToNextPage} = usePaginatedFetch(
    resourceUri ? `/api/resources/${encodeURIComponent(resourceUri)}/resource-evaluations` : null, {}, 10
  );

  console.log('data', data);
  return (
    <div className={`${styles[theme]}`}>
     <p className={styles.header}>Evaluation History</p>
      <Loading loading={loading}>
        {data && data?.length ?
          (
            data.map((evaluation) => {
              return (
                <p>{evaluation.resourceEvaluation.id}</p>
              )
            })
          )
        :
        <p>This resource has not been evaluated.</p>
        }
      </Loading>
    </div>
  );
};

ResourceEvaluationHistory.propTypes = {
  resourceUri: PropTypes.string.isRequired,
};

export default ResourceEvaluationHistory;
