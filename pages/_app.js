import React from "react";
import PropTypes from "prop-types";
import "../styles/globals.scss";
import Head from "next/head";

const MyApp = ({ Component, pageProps }) => {
  return (
    <React.Fragment>
      <Head>
        <title>Rode</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </React.Fragment>
  );
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.func,
  ]),
  pageProps: PropTypes.object,
};

export default MyApp;
