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
import styles from "styles/modules/Modal.module.scss";
import { useTheme } from "providers/theme";
import Button from "./Button";
import Icon from "./Icon";
import { ICON_NAMES } from "utils/icon-utils";

const Modal = (props) => {
  const { title, children, onClose, isVisible } = props;
  const { theme } = useTheme();

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${styles[theme]} ${styles.outerWrapper}`}
      role={"dialog"}
      aria-labelledby={"modalTitle"}
    >
      <Button
        buttonType={"modalClose"}
        label={"Close Modal"}
        className={styles.closeButton}
        onClick={onClose}
      >
        <Icon name={ICON_NAMES.X_CIRCLE} size="xlarge" />
      </Button>
      <div className={styles.contentWrapper}>
        <h1 id={"modalTitle"} className={styles.title}>
          {title}
        </h1>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
