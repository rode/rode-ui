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
import Editor from "react-simple-code-editor";
import Prism from "prism/prism";

const CodeEditor = (props) => {
  const {
    name,
    label,
    onChange,
    placeholder,
    value = "",
    required = false,
    error,
    ...otherProps
  } = props;
  const { theme } = useTheme();
  const className = error ? styles.codeEditorError : styles.codeEditor;

  const hightlightWithLineNumbers = (input) =>
    Prism.highlight(input, Prism.languages.rego)
      .split("\n")
      .map((line, i) => `<span class='line-numbers'>${i + 1}</span>${line}`)
      .join("\n");

  return (
    <div className={styles.outerWrapper}>
      <div className={`${styles[theme]} ${styles.container}`}>
        <label
          htmlFor={name}
          className={`${styles.label} ${required ? "required" : ""}`}
        >
          {label}
        </label>
        <Editor
          name={name}
          textareaId={name}
          onValueChange={onChange}
          placeholder={placeholder || label}
          value={value}
          tabSize={4}
          className={className}
          textareaClassName={className}
          preClassName={styles.codeInEditor}
          highlight={hightlightWithLineNumbers}
          padding={16}
          {...otherProps}
        />
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

CodeEditor.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange: function (props) {
    if (!props.disabled && !props.onChange) {
      return new Error(
        "The prop `onChange` is required in `CodeEditor` when the component is not disabled"
      );
    }
  },
};

export default CodeEditor;
