import React from "react";
import PropTypes from "prop-types";

const Input = (props) => {
  const { name, label, type, onChange, placeholder } = props;

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        type={type || "text"}
        name={name}
        id={name}
        onChange={onChange}
        placeholder={placeholder || label}
      />
    </>
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
