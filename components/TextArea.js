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
import styles from "styles/modules/Inputs.module.scss";
import { useTheme } from "providers/theme";

const TextArea = (props) => {
  const {
    name,
    label,
    onChange,
    placeholder,
    value = "",
    rows = 5,
    ...otherProps
  } = props;
  const { theme } = useTheme();

  return (
    <div className={`${styles[theme]} ${styles.container}`}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <textarea
        name={name}
        id={name}
        onChange={onChange}
        placeholder={placeholder || label}
        value={value}
        className={styles.textArea}
        rows={rows}
        {...otherProps}
      />
    </div>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  rows: PropTypes.number,
};

export default TextArea;