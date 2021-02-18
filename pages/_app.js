import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import "styles/globals.scss";
import { ThemeProvider } from "../hooks/useTheme";
import PageLayout from "../components/layout/PageLayout";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <React.Fragment>
        <Head>
          <title>Rode</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap"
            rel="stylesheet"
          />
        </Head>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </React.Fragment>
    </ThemeProvider>
  );
};

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default MyApp;
