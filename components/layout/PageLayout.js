import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../hooks/useTheme";
import Header from "./Header";

const PageLayout = ({ children }) => {
  const { theme } = useTheme();
  return (
    <>
      <Header />
      <main className={theme}>{children}</main>
    </>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageLayout;
