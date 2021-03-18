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

// TODO: make an error state for inputs
const Input = (props) => {
  const {
    name,
    label,
    type,
    onChange,
    placeholder,
    value = "",
    horizontal = false,
    required = false,
    error,
    ...otherProps
  } = props;
  const { theme } = useTheme();

  return (
    <div className={styles.outerWrapper}>
      <div
        className={`${styles[theme]} ${
          horizontal ? styles.horizontalContainer : styles.container
        }`}
      >
        <label
          htmlFor={name}
          className={`${styles.label} ${required ? "required" : ""}`}
        >
          {label}
        </label>
        <input
          type={type || "text"}
          name={name}
          id={name}
          onChange={onChange}
          value={value}
          placeholder={placeholder || label}
          className={`${error ? styles.inputError : styles.input}`}
          {...otherProps}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["number", "date", "text"]),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  horizontal: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
};

export default Input;
