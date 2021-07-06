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
import styles from "styles/modules/PolicyAssignmentCard.module.scss";
import LabelWithValue from "components/LabelWithValue";
import { useTheme } from "providers/theme";

const PolicyAssignmentCard = ({ policy, actions }) => {
  const { theme } = useTheme();
  return (
    <div className={`${styles.assignmentCard} ${styles[theme]}`}>
      <div>
        <LabelWithValue value={policy.policyName} />
        <LabelWithValue label={"Version"} value={policy.policyVersion} />
      </div>
      {actions}
    </div>
  );
};

PolicyAssignmentCard.propTypes = {
  policy: PropTypes.object.isRequired,
  actions: PropTypes.node.isRequired,
};

export default PolicyAssignmentCard;
