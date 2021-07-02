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
import styles from "styles/modules/EvaluationHistory.module.scss";
import { useTheme } from "providers/theme";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Loading from "components/Loading";
import Button from "components/Button";
import ResourceEvaluation from "./ResourceEvaluation";

// TODO: tests
const EvaluationHistory = (props) => {
  const { resourceUri } = props;
  const { theme } = useTheme();

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    resourceUri
      ? `/api/resources/${encodeURIComponent(resourceUri)}/resource-evaluations`
      : null,
    {},
    10
  );

  return (
    <div className={`${styles[theme]} ${styles.container}`}>
      <Loading loading={loading}>
        {data && data?.length ? (
          <>
            {data.map((evaluation) => {
              return (
                <ResourceEvaluation
                  evaluation={evaluation}
                  key={evaluation.id}
                />
              );
            })}
            {!isLastPage && (
              <Button
                buttonType="text"
                onClick={goToNextPage}
                label={"See More Evaluations"}
                id={"viewMoreEvaluationsButton"}
              />
            )}
          </>
        ) : (
          <p>This resource has not been evaluated.</p>
        )}
      </Loading>
    </div>
  );
};

EvaluationHistory.propTypes = {
  resourceUri: PropTypes.string.isRequired,
};

export default EvaluationHistory;
