import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "components/Button";
import styles from "styles/modules/Occurrences.module.scss";

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
            <code>{JSON.stringify(occurrence, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

OccurrenceCodeBlock.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default OccurrenceCodeBlock;
