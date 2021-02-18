import React from "react";
import styles from "styles/modules/Toggle.module.scss";
import { useTheme } from "hooks/useTheme";
import { DARK_THEME } from "../../utils/theme-utils";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isActive = theme === DARK_THEME;

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <span id={"toggle-theme"}>Dark Mode: {isActive ? "ON" : "OFF"}</span>
      <button
        className={styles.toggle}
        onClick={toggleTheme}
        role="switch"
        aria-checked={isActive}
        aria-labelledby={"toggle-theme"}
      >
        <div className={styles.indicator} />
      </button>
    </div>
  );
};

export default ThemeToggle;
