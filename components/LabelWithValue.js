import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Typography.module.scss";

const LabelWithValue = (props) => {
  const { label, value, className = "" } = props;

  if (!value) {
    return null;
  }

  return (
    <p className={` ${styles.labelWithValueContainer} ${className}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </p>
  );
};

LabelWithValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
};

export default LabelWithValue;
