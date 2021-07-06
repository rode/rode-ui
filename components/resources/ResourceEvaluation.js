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
import styles from "styles/modules/ResourceEvaluation.module.scss";
import { useTheme } from "providers/theme";
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";
import PolicyEvaluationDetails from "./PolicyEvaluationDetails";
import LabelWithValue from "components/LabelWithValue";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "utils/constants";
import ToggleCard from "components/ToggleCard";

const ResourceEvaluation = (props) => {
  const { evaluation } = props;
  const { theme } = useTheme();

  const evaluationOutcome = evaluation.pass ? "pass" : "fail";

  return (
    <ToggleCard
      className={`${styles[theme]} ${styles.resourceEvaluationCard}`}
      header={
        <div className={styles.resourceEvaluationDetails}>
          <div
            className={`${styles[evaluationOutcome]} ${styles.evaluationResult}`}
          >
            {evaluation.pass ? (
              <Icon name={ICON_NAMES.BADGE_CHECK} size={"large"} />
            ) : (
              <Icon name={ICON_NAMES.EXCLAMATION} size={"large"} />
            )}
            <p>{evaluationOutcome}</p>
          </div>
          <LabelWithValue
            label={"Policy Group"}
            value={evaluation.policyGroup}
          />
          <LabelWithValue
            label={"Completed"}
            value={dayjs(evaluation.created).format(DATE_TIME_FORMAT)}
          />
        </div>
      }
      content={
        <div className={styles.policyEvaluationsContainer}>
          <p>{evaluation.policyEvaluations.length} Policies Evaluated</p>
          {evaluation.policyEvaluations.map((policyEvaluation) => {
            return (
              <PolicyEvaluationDetails
                policyEvaluation={policyEvaluation}
                key={policyEvaluation.id}
              />
            );
          })}
        </div>
      }
    />
  );
};
ResourceEvaluation.propTypes = {
  evaluation: PropTypes.object.isRequired,
};

export default ResourceEvaluation;
