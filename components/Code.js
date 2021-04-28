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

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Prism from "prism/prism";
import styles from "styles/modules/Typography.module.scss";

// TODO: how to prevent non-highlighted code before highlight appears?
const Code = (props) => {
  const { code, language, className = "", ...otherProps } = props;

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
    <pre className={`${styles.codeContainer} ${className}`} {...otherProps}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};

Code.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.oneOf(["rego", "json"]).isRequired,
  className: PropTypes.string,
};

export default Code;
