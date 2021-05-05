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
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "./Icon";
import styles from "styles/modules/Typography.module.scss";
import { useTheme } from "providers/theme";

const ExternalLink = (props) => {
  const { theme } = useTheme();
  const { href, label, className = "", fallback = null } = props;

  if (!href) {
    return fallback;
  }

  return (
    <a
      className={`${styles[theme]} ${styles.externalLink} ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {label}
      <Icon name={ICON_NAMES.EXTERNAL_LINK} size={"small"} />
    </a>
  );
};

ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallback: PropTypes.node,
};

export default ExternalLink;
