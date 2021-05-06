import React, { useState, useEffect } from "react";
import styles from "styles/modules/Drawer.module.scss";
import PropTypes from "prop-types";
import Button from "./Button";
import Icon from "./Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { useTheme } from "providers/theme";

// TODO: test this

const Drawer = (props) => {
  const {isOpen, onClose, children} = props;
  const {theme} = useTheme();

  return (
    <div className={`${styles[theme]} ${isOpen ? styles.openDrawer : styles.closedDrawer}`}>
      <Button
        buttonType={"close"}
        label={"Close Drawer"}
        className={styles.closeButton}
        onClick={onClose}
      >
        <Icon name={ICON_NAMES.X_CIRCLE} size="xlarge" />
      </Button>
      {children}
    </div>
  );
};

Drawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Drawer;