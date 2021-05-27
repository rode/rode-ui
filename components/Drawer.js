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

import React, { useEffect, useRef } from "react";
import styles from "styles/modules/Drawer.module.scss";
import PropTypes from "prop-types";
import Button from "./Button";
import Icon from "./Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { useTheme } from "providers/theme";

const Drawer = (props) => {
  const { isOpen, onClose, testId = "drawer", children } = props;
  const { theme } = useTheme();
  const ref = useRef(null);

  const closeDrawerWhenClickingOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDrawerWhenClickingOutside);
    return () => {
      document.removeEventListener("mousedown", closeDrawerWhenClickingOutside);
    };
  }, []);

  return (
    <div
      className={`${styles[theme]} ${
        isOpen ? styles.openDrawer : styles.closedDrawer
      }`}
      ref={ref}
      data-testid={testId}
    >
      <Button
        buttonType={"close"}
        label={"Close Drawer"}
        className={styles.closeButton}
        onClick={onClose}
      >
        <Icon name={ICON_NAMES.X_CIRCLE} size="xlarge" />
      </Button>
      {children}
    </div>
  );
};

Drawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  testId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default Drawer;
