import React from "react";
import PropTypes from "prop-types";
import "../styles/globals.scss";
import Head from "next/head";
import Header from "../components/Header";

const MyApp = ({ Component, pageProps }) => {
  return (
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
      <Header />
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
