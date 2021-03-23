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
import styles from "styles/modules/Policy.module.scss";
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";

const PolicyValidationResult = ({ validation }) => {
  if (!validation) {
    return null;
  }

  return (
    <>
      {validation.isValid ? (
        <div className={styles.validationResults}>
          <Icon name={ICON_NAMES.BADGE_CHECK} />
          <p>Policy is valid</p>
        </div>
      ) : (
        <div className={styles.failedResultsContainer}>
          <div className={styles.validationResults}>
            <Icon name={ICON_NAMES.EXCLAMATION} />
            <p>Policy is invalid</p>
          </div>
          <pre>
            <code>{validation.errors}</code>
          </pre>
        </div>
      )}
    </>
  );
};

PolicyValidationResult.propTypes = {
  validation: PropTypes.object,
};

export default PolicyValidationResult;
