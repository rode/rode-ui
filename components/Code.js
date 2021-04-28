import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Prism from "prism/prism";
import styles from "styles/modules/Typography.module.scss";

// TODO: test this
// TODO: how to prevent non-highlighted code before highlight appears?
const Code = (props) => {
  const { code, language, className = "", ...otherProps } = props;

  useEffect(() => {
    Prism.highlightAll();
  }, []);

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
