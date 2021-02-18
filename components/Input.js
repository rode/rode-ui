import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Inputs.module.scss";

const Input = (props) => {
  const { name, label, type, onChange, placeholder } = props;

  return (
    <div className={styles.container}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        type={type || "text"}
        name={name}
        id={name}
        onChange={onChange}
        placeholder={placeholder || label}
        className={styles.input}
      />
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["number", "date", "text"]),
  placeholder: PropTypes.string,
};

export default Input;
