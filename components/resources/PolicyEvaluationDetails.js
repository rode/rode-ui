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
import { useTheme } from "providers/theme";
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";
import styles from "styles/modules/PolicyEvaluationDetails.module.scss";
import ToggleCard from "components/ToggleCard";
import Text from "components/Text";
import Link from "next/link";

const PolicyEvaluationDetails = (props) => {
  const { policyEvaluation } = props;
  const { theme } = useTheme();

  return (
    <ToggleCard
      className={`${styles[theme]} ${styles.policyEvaluationCard}`}
      header={
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
          <Text.Body1>
            <Link href={`/policies/${policyEvaluation.policyVersionId}`}>
              {policyEvaluation.policyName}
            </Link>
          </Text.Body1>
          <Text.Value>v{policyEvaluation.policyVersion}</Text.Value>
        </div>
      }
      content={
        <div className={styles.violationsContainer}>
          {policyEvaluation.violations.map((violation) => {
            const outcome = violation.pass ? "pass" : "fail";

            return (
              <div key={violation.id} className={styles.violation}>
                <Text.Body1
                  className={`${styles[outcome]} ${styles.violationResult}`}
                >
                  {outcome}
                </Text.Body1>
                <Text.Body1>{violation.message}</Text.Body1>
              </div>
            );
          })}
        </div>
      }
    />
  );
};

PolicyEvaluationDetails.propTypes = {
  policyEvaluation: PropTypes.object.isRequired,
};

export default PolicyEvaluationDetails;
