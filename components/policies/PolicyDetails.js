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
import styles from "styles/modules/PolicyDetails.module.scss";
import Code from "components/Code";
import { useTheme } from "providers/theme";
import Text from "components/Text";

const PolicyDetails = ({ policy }) => {
  const { theme } = useTheme();

  return (
    <div className={`${styles[theme]} ${styles.container}`}>
      <div className={styles.regoContainer}>
        <Text.Label as={"p"}>Rego Policy Code</Text.Label>
        <Code
          code={policy.regoContent}
          language={"rego"}
          className={styles.regoPolicyCode}
        />
      </div>
    </div>
  );
};

PolicyDetails.propTypes = {
  policy: PropTypes.object.isRequired,
};

export default PolicyDetails;
