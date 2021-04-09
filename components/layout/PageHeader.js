import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Header.module.scss";

const PageHeader = ({ children }) => {
  return <div className={styles.pageHeader}>{children}</div>;
};

PageHeader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
};

export default PageHeader;
