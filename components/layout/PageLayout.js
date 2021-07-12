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
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from "providers/theme";
import ErrorBoundary from "components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import styles from "styles/modules/Toasts.module.scss";

import "react-toastify/dist/ReactToastify.min.css";
import Button from "components/Button";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

const PageLayout = ({ auth, children }) => {
  const { theme } = useTheme();
  return (
    <>
      <ToastContainer
        position="top-center"
        hideProgressBar="true"
        autoClose={false}
        className={styles[theme]}
        closeButton={({ closeToast }) => (
          <Button
            onClick={closeToast}
            buttonType={"icon"}
            label={"close alert"}
            className={styles.closeButton}
          >
            <Icon name={ICON_NAMES.X_CIRCLE} />
          </Button>
        )}
      />
      <Header auth={auth} />
      <main className={theme}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
    </>
  );
};

PageLayout.propTypes = {
  auth: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default PageLayout;
