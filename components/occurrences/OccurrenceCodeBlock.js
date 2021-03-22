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
import Button from "components/Button";
import styles from "styles/modules/OccurrenceDetails.module.scss";
import { useResources } from "providers/resources";

const OccurrenceCodeBlock = ({ json, fullWidth = false }) => {
  const [showCode, setShowCode] = useState(false);

  const { state } = useResources();

  useEffect(() => {
    if (state.occurrenceDetails) {
      setShowCode(false);
    }
  }, [state.occurrenceDetails]);

  const toggle = () => {
    setShowCode(!showCode);
  };

  return (
    <div
      className={
        fullWidth
          ? styles.fullWidthCodeBlockContainer
          : styles.codeBlockContainer
      }
    >
      <Button onClick={toggle} label={showCode ? "Hide JSON" : "Show JSON"} />
      {showCode && (
        <pre className={styles.codeBlock} data-testid="occurrenceJson">
          <code>{JSON.stringify(json, null, 2)}</code>
        </pre>
      )}
    </div>
  );
};

OccurrenceCodeBlock.propTypes = {
  json: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  fullWidth: PropTypes.bool,
};

export default OccurrenceCodeBlock;
