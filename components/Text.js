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
import { useTheme } from "providers/theme";

const BaseText = (props) => {
  const { className = "", as, style, children, ...otherProps } = props;
  const { theme } = useTheme();

  if (!children) {
    return null;
  }

  const Tag = as;

  return (
    <Tag
      className={`${styles[style]} ${styles[theme]} ${className}`}
      {...otherProps}
    >
      {children}
    </Tag>
  );
};

BaseText.propTypes = {
  className: PropTypes.string,
  as: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "p",
    "label",
    "a",
  ]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]),
  style: PropTypes.oneOf([
    "heading1",
    "heading2",
    "heading3",
    "label",
    "value",
    "body1",
    "body2",
    "caption",
  ]).isRequired,
};

/* eslint-disable react/prop-types */

const Heading1 = ({ children, ...otherProps }) => {
  return (
    <BaseText as={"h1"} style={"heading1"} {...otherProps}>
      {children}
    </BaseText>
  );
};
const Heading2 = ({ children, ...otherProps }) => {
  return (
    <BaseText as={"h2"} style={"heading2"} {...otherProps}>
      {children}
    </BaseText>
  );
};
const Heading3 = ({ children, ...otherProps }) => {
  return (
    <BaseText as={"h3"} style={"heading3"} {...otherProps}>
      {children}
    </BaseText>
  );
};
const Body1 = ({ children, ...otherProps }) => {
  return (
    <BaseText as={"p"} style={"body1"} {...otherProps}>
      {children}
    </BaseText>
  );
};
const Body2 = ({ children, ...otherProps }) => {
  return (
    <BaseText as={"p"} style={"body2"} {...otherProps}>
      {children}
    </BaseText>
  );
};
const Caption = ({ children, ...otherProps }) => {
  return (
    <BaseText as={"span"} style={"caption"} {...otherProps}>
      {children}
    </BaseText>
  );
};
const Label = ({ children, ...otherProps }) => {
  return (
    <BaseText as={"label"} style={"label"} {...otherProps}>
      {children}
    </BaseText>
  );
};
const Value = ({ children, ...otherProps }) => {
  return (
    <BaseText as={"span"} style={"value"} {...otherProps}>
      {children}
    </BaseText>
  );
};

/* eslint-enable react/prop-types */

const Text = {
  Heading1,
  Heading2,
  Heading3,
  Body1,
  Body2,
  Caption,
  Label,
  Value,
};

export default Text;
