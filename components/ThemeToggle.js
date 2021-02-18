import React from "react";
import PropTypes from 'prop-types';
import styles from 'styles/modules/Toggle.module.scss';
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const {theme, toggleTheme} = useTheme();

  return (
    <button className={styles.container} onClick={toggleTheme}>
      <div className={theme === 'dark' ? styles.active : styles.inactive}>
      </div>
    </button>
  )
};

ThemeToggle.propTypes = {
  active: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}

export default ThemeToggle;