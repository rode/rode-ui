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
import styles from "styles/modules/ResourceEvaluation.module.scss";
import { useTheme } from "providers/theme";
import { useAppState } from "providers/appState";
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";
import PolicyEvaluationDetails from "./PolicyEvaluationDetails";

// TODO: tests
const ResourceEvaluation = (props) => {
  const { evaluation } = props;
  const { state } = useAppState();
  const { theme } = useTheme();
  const [showDetail, setShowDetail] = useState(false);

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  return (
    <div className={`${styles[theme]} ${styles.resourceEvaluationCard}`}>
      <div
        className={styles.resourceEvaluationCardHeader}
        onClick={toggleDetail}
      >
        {evaluation.pass ? (
          <p className={`${styles.pass}`}>
            <Icon name={ICON_NAMES.BADGE_CHECK} size={"large"}/>
            Pass
          </p>
        ) : (
          <p className={`${styles.fail}`}>
            <Icon name={ICON_NAMES.EXCLAMATION} size={"large"} />
            Fail
          </p>
        )}
        <p>{evaluation.created}</p>
        <p>{evaluation.policyEvaluations.length} Policies Evaluated</p>
        <Icon name={ICON_NAMES.CHEVRON_RIGHT} />
      </div>
      {showDetail && (
        <div className={styles.policyEvaluationsContainer}>
          <p>Policy Group {evaluation.policyGroup}</p>
          {evaluation.policyEvaluations.map((policyEvaluation) => {
            return (
              <PolicyEvaluationDetails
                policyEvaluation={policyEvaluation}
                key={policyEvaluation.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
ResourceEvaluation.propTypes = {
  evaluation: PropTypes.object.isRequired,
};

export default ResourceEvaluation;
