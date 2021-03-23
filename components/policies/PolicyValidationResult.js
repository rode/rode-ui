import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Policy.module.scss";
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";

// TODO: test this file

const PolicyValidationResult = ({ validation }) => {
  if (!validation) {
    return null;
  }

  return (
    <>
      {validation.isValid ? (
        <div className={styles.validationResults}>
          <Icon name={ICON_NAMES.BADGE_CHECK} />
          <p>Policy is valid</p>
        </div>
      ) : (
        <div className={styles.failedResultsContainer}>
          <div className={styles.validationResults}>
            <Icon name={ICON_NAMES.EXCLAMATION} />
            <p>Policy is invalid</p>
          </div>
          <pre>
            <code>{validation.errors}</code>
          </pre>
        </div>
      )}
    </>
  );
};

PolicyValidationResult.propTypes = {
  validation: PropTypes.object,
};

export default PolicyValidationResult;
