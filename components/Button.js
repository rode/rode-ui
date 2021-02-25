import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Buttons.module.scss";

const Button = (props) => {
  const {
    onClick,
    label,
    buttonType = "primary",
    disabled = false,
    children,
    ...otherProps
  } = props;

  return (
    <button
      className={styles[buttonType]}
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      {...otherProps}
    >
      {children || label}
    </button>
  );
};

Button.propTypes = {
  onClick: function (props) {
    if (props.type !== "submit" && !props.onClick) {
      throw new Error(
        "The prop `onClick` is required in `Button` for those not of type `submit`"
      );
    }
  },
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  buttonType: PropTypes.oneOf(["primary", "icon"]),
  children: PropTypes.node,
};

export default Button;
