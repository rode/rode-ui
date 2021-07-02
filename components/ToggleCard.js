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
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";
import styles from "styles/modules/ToggleCard.module.scss";

const ToggleCard = (props) => {
  const { header, content, className = "" } = props;
  const { theme } = useTheme();
  const [showDetail, setShowDetail] = useState(false);

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  };

  return (
    <div
      className={`${styles[theme]} ${styles.toggleCard} ${className}`}
      data-testid={"toggleCard"}
    >
      <button
        onClick={toggleDetail}
        className={styles.toggleCardHeader}
        aria-label={"Toggle Card Details"}
      >
        <div className={styles.headerContent}>{header}</div>

        <Icon
          name={ICON_NAMES.CHEVRON_RIGHT}
          className={showDetail ? styles.toggleIconExpanded : styles.toggleIcon}
        />
      </button>

      {showDetail && content}
    </div>
  );
};

ToggleCard.propTypes = {
  header: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ToggleCard;
