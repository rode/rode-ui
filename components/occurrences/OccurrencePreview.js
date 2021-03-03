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
import styles from "styles/modules/Occurrences.module.scss";
import { useTheme } from "providers/theme";

const OccurrencePreview = ({ mainText, timestamp, subText, occurrence }) => {
  const { theme } = useTheme();

  const onClick = () => {
    console.log('occurrence clicked', occurrence);
  }

  return (
    <button className={`${styles.container} ${styles[theme]}`} onClick={onClick}>
      <p>{mainText}</p>
      <p>{timestamp}</p>
      <p>{subText}</p>
    </button>
  );
};

OccurrencePreview.propTypes = {
  occurrence: PropTypes.object.isRequired,
  mainText: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  subText: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

export default OccurrencePreview;
