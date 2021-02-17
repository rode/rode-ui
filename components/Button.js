import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/modules/Buttons.module.scss";

const Button = (props) => {
  const { onClick, label, buttonType = "primary", children } = props;

  return (
    <button className={styles[buttonType]} onClick={onClick} aria-label={label}>
      {children || label}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  buttonType: PropTypes.oneOf(["primary", "icon"]),
  children: PropTypes.node,
};

export default Button;
