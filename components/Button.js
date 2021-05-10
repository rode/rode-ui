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
import styles from "styles/modules/Buttons.module.scss";
import { useTheme } from "providers/theme";
import Loading from "./Loading";

const Button = (props) => {
  const {
    onClick,
    label,
    buttonType = "primary",
    disabled = false,
    children,
    className = "",
    loading = false,
    ...otherProps
  } = props;

  const { theme } = useTheme();

  return (
    <button
      className={`${styles[buttonType]} ${styles[theme]} ${className}`}
      onClick={onClick}
      aria-label={label}
      disabled={disabled || loading}
      {...otherProps}
    >
      <Loading type={"button"} loading={loading}>
        {children || label}
      </Loading>
    </button>
  );
};

Button.propTypes = {
  onClick: function (props) {
    if (props.type !== "submit" && !props.onClick) {
      return new Error(
        "The prop `onClick` is required in `Button` for those not of type `submit`"
      );
    }
  },
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  buttonType: PropTypes.oneOf([
    "primary",
    "icon",
    "text",
    "textOnAccent",
    "textDestructive",
    "primaryDestructive",
    "close",
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export default Button;
