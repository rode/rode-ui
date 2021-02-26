import React from "react";
import styles from "styles/modules/Loading.module.scss";
import { useTheme } from "../hooks/useTheme";

const Loading = () => {
  const { theme } = useTheme();
  return (
    <div className={styles.container} data-testid="loadingIndicator">
      <div className={`${styles.spinner} ${styles[theme]}`} />
    </div>
  );
};

export default Loading;
