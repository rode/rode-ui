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
import styles from "styles/modules/Search.module.scss";
import { useTheme } from "providers/theme";

const SearchResult = (props) => {
  const { mainText, subText, additionalText, actionButton } = props;
  const { theme } = useTheme();

  return (
    <div className={`${styles[theme]} ${styles.searchCard}`}>
      <div>
        <p className={styles.cardHeader}>{mainText}</p>
        <p className={styles.cardText}>{subText}</p>
        {additionalText && <p className={styles.cardText}>{additionalText}</p>}
      </div>
      {actionButton}
    </div>
  );
};

SearchResult.propTypes = {
  mainText: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  additionalText: PropTypes.string,
  actionButton: PropTypes.node.isRequired,
};

export default SearchResult;
