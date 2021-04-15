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
import Button from "components/Button";
import styles from "styles/modules/Playground.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

const PlaygroundSearchResult = ({
  mainText,
  subText,
  additionalText,
  buttonText,
  onClick,
  selected,
}) => {
  return (
    <div className={`${styles.searchCard}`}>
      <div>
        <p className={styles.cardHeader}>{mainText}</p>
        <p className={styles.cardText}>{subText}</p>
        {additionalText && <p className={styles.cardText}>{additionalText}</p>}
      </div>
      <Button
        onClick={onClick}
        buttonType={"text"}
        label={selected ? "Selected" : buttonText}
        disabled={selected}
        className={selected ? styles.selectedButton : styles.actionButton}
      >
        {selected && (
          <>
            <Icon name={ICON_NAMES.CHECK} />
            <p>Selected</p>
          </>
        )}
      </Button>
    </div>
  );
};

PlaygroundSearchResult.propTypes = {
  mainText: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  additionalText: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default PlaygroundSearchResult;
