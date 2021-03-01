/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import "styles/globals.scss";
import { ThemeProvider } from "providers/theme";
import { ResourcesProvider } from "providers/resources";
import PageLayout from "components/layout/PageLayout";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <ResourcesProvider>
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
      </ResourcesProvider>
    </ThemeProvider>
  );
};

MyApp.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default MyApp;
