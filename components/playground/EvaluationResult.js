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
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

// TODO: tests

const EvaluationResult = ({ results }) => {
  if (!results) {
    return null;
  }

  return (
    <div className={styles.evaluationResultsContainer}>
      {results.pass ? (
        <div className={styles.evaluationResults}>
          <Icon name={ICON_NAMES.BADGE_CHECK} />
          <p>The resource passed the policy.</p>
        </div>
      ) : (
        <div>
          <div className={styles.failedEvaluationResults}>
            <Icon name={ICON_NAMES.EXCLAMATION} />
            <p>The resource failed the policy.</p>
          </div>
          <pre>
            <code>{results.explanation}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

EvaluationResult.propTypes = {
  results: PropTypes.object,
};

export default EvaluationResult;
