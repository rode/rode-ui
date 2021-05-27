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
import Code from "components/Code";
import textStyles from "styles/modules/Typography.module.scss";
import LabelWithValue from "components/LabelWithValue";

const SelectedPolicy = (props) => {
  const { policy } = props;

  return (
    <>
      {policy ? (
        <>
          <LabelWithValue label={"Policy"} value={policy.name} />
          <p className={textStyles.label}>Rego Policy Code</p>
          <Code
            code={policy.regoContent}
            language={"rego"}
            className={styles.codeContent}
            data-testid={"regoPolicyCode"}
          />
        </>
      ) : (
        <p className={styles.selectToBeginText}>Search for a policy to begin</p>
      )}
    </>
  );
};
SelectedPolicy.propTypes = {
  policy: PropTypes.object,
};

export default SelectedPolicy;
