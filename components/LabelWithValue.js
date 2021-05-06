import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Typography.module.scss";

// TODO: test this

const LabelWithValue = (props) => {
  const { label, value, className = "", as = "p" } = props;

  const Text = as;

  if (!value) {
    return null;
  }

  return (
    <Text className={` ${styles.labelWithValueContainer} ${className}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </Text>
  );
};

LabelWithValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  as: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"]),
};

export default LabelWithValue;
