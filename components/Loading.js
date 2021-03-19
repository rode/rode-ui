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
import styles from "styles/modules/Loading.module.scss";
import { useTheme } from "providers/theme";

const Loading = ({ loading, children }) => {
  const { theme } = useTheme();

  if (!loading) {
    return children;
  }

  return (
    <div className={styles.container} data-testid="loadingIndicator">
      <div className={`${styles.spinner} ${styles[theme]}`} />
    </div>
  );
};

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Loading;
