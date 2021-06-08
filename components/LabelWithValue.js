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
import styles from "styles/modules/Typography.module.scss";

const LabelWithValue = (props) => {
  const { label, value, vertical = false, className = "", as = "p" } = props;

  if (!value) {
    return null;
  }

  const Text = as;

  return (
    <Text
      className={` ${
        vertical
          ? styles.verticalLabelWithValueContainer
          : styles.labelWithValueContainer
      } ${className}`}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </Text>
  );
};

LabelWithValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  vertical: PropTypes.bool,
  as: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "span"]),
};

export default LabelWithValue;
