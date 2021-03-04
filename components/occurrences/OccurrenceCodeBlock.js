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

import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "components/Button";
import styles from "styles/modules/Occurrences.module.scss";

// TODO: reset toggle when the selected occurrence changes
const OccurrenceCodeBlock = ({ occurrence }) => {
  const [showCode, setShowCode] = useState(false);

  const toggle = () => {
    setShowCode(!showCode);
  };

  return (
    <div className={styles.codeBlockContainer}>
      <Button onClick={toggle} label={showCode ? "Hide JSON" : "Show JSON"} />
      {showCode && (
        <div className={styles.codeBlock} data-testid="occurrenceJson">
          <pre>
            <code>{JSON.stringify(occurrence.originals, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

OccurrenceCodeBlock.propTypes = {
  occurrence: PropTypes.array.isRequired,
};

export default OccurrenceCodeBlock;
