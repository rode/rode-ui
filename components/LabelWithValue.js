import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Typography.module.scss";

const LabelWithValue = (props) => {
  const { label, value, vertical = false, className = "" } = props;

  if (!value) {
    return null;
  }

  return (
    <p
      className={` ${
        vertical
          ? styles.verticalLabelWithValueContainer
          : styles.labelWithValueContainer
      } ${className}`}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </p>
  );
};

LabelWithValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string,
  vertical: PropTypes.bool,
};

export default LabelWithValue;
