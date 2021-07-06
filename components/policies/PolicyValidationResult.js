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
import styles from "styles/modules/PolicyValidationResult.module.scss";
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";
import Code from "components/Code";
import { useTheme } from "providers/theme";
import Text from "components/Text";

const PolicyValidationResult = ({ validation }) => {
  const { theme } = useTheme();
  if (!validation) {
    return null;
  }

  return (
    <>
      {validation.isValid ? (
        <div className={`${styles[theme]} ${styles.validationResults}`}>
          <Icon name={ICON_NAMES.BADGE_CHECK} />
          <Text.Body1>This policy passes validation.</Text.Body1>
        </div>
      ) : (
        <div className={`${styles[theme]} ${styles.failedResultsContainer}`}>
          <div className={styles.validationResults}>
            <Icon name={ICON_NAMES.EXCLAMATION} />
            <Text.Body1>This policy failed validation.</Text.Body1>
          </div>
          {validation.errors?.length ? (
            <Code
              code={validation.errors.filter((error) => error.length)}
              language={"json"}
            />
          ) : null}
        </div>
      )}
    </>
  );
};

PolicyValidationResult.propTypes = {
  validation: PropTypes.object,
};

export default PolicyValidationResult;
