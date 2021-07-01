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
import { useTheme } from "providers/theme";
import { ICON_NAMES } from "../../utils/icon-utils";
import Icon from "../Icon";
import styles from "styles/modules/PolicyEvaluationDetails.module.scss";
import LabelWithValue from "../LabelWithValue";

// TODO: tests
const PolicyEvaluationDetails = (props) => {
  const { policyEvaluation } = props;
  const { theme } = useTheme();
  const [showDetail, setShowDetail] = useState(false);

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  return (
    <div
      key={policyEvaluation.id}
      className={`${styles[theme]} ${styles.policyEvaluationCard}`}
    >
      <div onClick={toggleDetail} className={styles.policyEvaluationCardHeader}>
        <div className={styles.policyDetails}>
          {policyEvaluation.pass ? (
            <Icon
              name={ICON_NAMES.BADGE_CHECK_OUTLINE}
              size={"large"}
              className={styles.pass}
            />
          ) : (
            <Icon
              name={ICON_NAMES.EXCLAMATION_OUTLINE}
              size={"large"}
              className={styles.fail}
            />
          )}
          <p>{policyEvaluation.policyName}</p>
          <p>v{policyEvaluation.policyVersion}</p>
        </div>
        <Icon name={ICON_NAMES.CHEVRON_RIGHT} />
      </div>
      {showDetail && (
        <div>
          {policyEvaluation.violations.map((violation) => {
            console.log("violation", violation);
            const outcome = violation.pass ? "pass" : "fail";

            return (
              <div key={violation.id} className={styles.violations}>
                <p className={`${styles[outcome]} ${styles.violationResult}`}>
                  {outcome}
                </p>
                <p>{violation.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

PolicyEvaluationDetails.propTypes = {
  policyEvaluation: PropTypes.object.isRequired,
};

export default PolicyEvaluationDetails;
