import React from "react";
import PropTypes from "prop-types";
import { ICON_COMPONENTS, ICON_NAMES } from "../utils/icon-utils";
import styles from "../styles/modules/Icons.module.scss";

const Icon = (props) => {
  const { name, size = "medium" } = props;

  const IconComponent = ICON_COMPONENTS[name];

  return (
    <div className={styles[size]}>
      <IconComponent />
    </div>
  );
};

Icon.propTypes = {
  name: PropTypes.oneOf(Object.values(ICON_NAMES)).isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default Icon;
