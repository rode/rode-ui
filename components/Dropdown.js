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
import Select from "react-select";

const Dropdown = (props) => {
  const {
    name,
    label,
    onChange,
    placeholder,
    options,
    required = false,
    error,
    classNamePrefix = "",
    ...otherProps
  } = props;
  const { theme } = useTheme();

  return (
    <div className={styles.outerWrapper}>
      <div className={`${styles[theme]} ${styles.container}`}>
        <label
          htmlFor={name}
          className={`${styles.label} ${required ? "required" : ""}`}
        >
          {label}
        </label>
        <Select
          name={name}
          id={name}
          options={options}
          onChange={onChange}
          placeholder={placeholder || label}
          classNamePrefix={`${theme} ${classNamePrefix} ${error ? "error" : ""} dropdown`}
          {...otherProps}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

Dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.array.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange: PropTypes.func.isRequired,
  classNamePrefix: PropTypes.string,
};

export default Dropdown;
