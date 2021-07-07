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

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Occurrences.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import Text from "components/Text";

const OccurrencePreview = ({
  mainText,
  timestamp,
  subText,
  currentOccurrence,
}) => {
  const [isActive, setIsActive] = useState(false);
  const { state, dispatch } = useAppState();

  useEffect(() => {
    setIsActive(
      state.occurrenceDetails?.originals.occurrences[0].name ===
        currentOccurrence?.originals.occurrences[0].name
    );
  }, [state.occurrenceDetails]);

  const onClick = () => {
    dispatch({
      type: stateActions.SET_OCCURRENCE_DETAILS,
      data: isActive ? null : currentOccurrence,
    });
  };

  return (
    <button
      className={`${styles.previewContainer} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.previewDetails}>
        <Text.Body1 className={styles.previewMainText}>{mainText}</Text.Body1>
        <Text.Body2 className={styles.previewTimestamp}>{timestamp}</Text.Body2>
        <Text.Body2 className={styles.previewSubText}>{subText}</Text.Body2>
      </div>
      <Icon
        name={
          isActive ? ICON_NAMES.CHEVRON_DOUBLE_RIGHT : ICON_NAMES.CHEVRON_RIGHT
        }
      />
    </button>
  );
};

OccurrencePreview.propTypes = {
  currentOccurrence: PropTypes.object.isRequired,
  mainText: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  subText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default OccurrencePreview;
