import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Prism from "prism/prism";
import styles from "styles/modules/Typography.module.scss";

// TODO: test this
const RegoCode = (props) => {
  const {code} = props;

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre className={styles.regoContainer}>
      <code className={'language-rego'}>{code}</code>
    </pre>
  );
};

RegoCode.propTypes = {
  code: PropTypes.string.isRequired
};

export default RegoCode;