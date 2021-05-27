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
import styles from "styles/modules/Playground.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import Button from "components/Button";
import Modal from "components/Modal";
import { copy } from "utils/shared-utils";
import Code from "components/Code";

const EvaluationResult = ({ results }) => {
  const [showCode, setShowCode] = useState(false);

  if (!results) {
    return null;
  }

  const formattedExplanation = JSON.stringify(results.explanation, null, 2);

  return (
    <>
      {results.pass ? (
        <div className={styles.evaluationResults}>
          <Icon name={ICON_NAMES.BADGE_CHECK} size={"large"} />
          <p>The resource passed the policy.</p>
        </div>
      ) : (
        <div className={styles.failedEvaluationResults}>
          <Icon name={ICON_NAMES.EXCLAMATION} size={"large"} />
          <p>The resource failed the policy.</p>
        </div>
      )}
      <div className={styles.violations}>
        {results.result[0].violations.map((violation) => {
          const outcome = violation.pass ? "pass" : "fail";
          return (
            <React.Fragment key={violation.id}>
              <p className={`${styles.violationResult} ${styles[outcome]}`}>
                {outcome}
              </p>
              <p>
                {violation.message || "Rule message not specified in policy"}
              </p>
            </React.Fragment>
          );
        })}
      </div>
      <Button
        onClick={() => setShowCode(true)}
        label={"Show Full Evaluation"}
        buttonType={"text"}
      />
      <Modal
        title={"Evaluation Explanation"}
        onClose={() => setShowCode(false)}
        isVisible={showCode}
      >
        <Button
          onClick={() => copy(formattedExplanation)}
          label={"Copy to Clipboard"}
          buttonType={"text"}
          className={styles.copyButton}
        />
        <Code
          code={formattedExplanation}
          language={"json"}
          className={styles.explanationJson}
          data-testid="codeBlock"
        />
      </Modal>
    </>
  );
};

EvaluationResult.propTypes = {
  results: PropTypes.object,
};

export default EvaluationResult;
