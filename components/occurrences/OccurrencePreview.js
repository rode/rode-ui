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

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import styles from "styles/modules/Occurrences.module.scss";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";

const OccurrencePreview = ({ mainText, timestamp, subText, occurrences }) => {
  const [isActive, setIsActive] = useState(false);
  const { state, dispatch } = useResources();

  useEffect(() => {
    setIsActive(
      state.occurrenceDetails?.original[0].name ===
        occurrences?.original[0].name
    );
  }, [state.occurrenceDetails]);

  const onClick = () => {
    dispatch({
      type: resourceActions.SET_OCCURRENCE_DETAILS,
      data: occurrences,
    });
  };

  return (
    <button
      className={`${styles.container} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.previewDetails}>
        <p className={styles.previewMainText}>{mainText}</p>
        <p className={styles.previewTimestamp}>{`Completed at ${dayjs(
          timestamp
        ).format("h:mm:ssa | MM-DD-YYYY")}`}</p>
        <p className={styles.previewSubText}>{subText}</p>
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
  occurrences: PropTypes.object.isRequired,
  mainText: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  subText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default OccurrencePreview;
