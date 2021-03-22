import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Policy.module.scss";
import { ICON_NAMES } from "utils/icon-utils";
import Icon from "components/Icon";

// TODO: improve the styles, add some colors

const PolicyValidationResult = ({ validation }) => {
  if (!validation) {
    return null;
  }

  return (
    <div className={styles.validationResults}>
      {validation.isValid ? (
        <>
          <Icon name={ICON_NAMES.BADGE_CHECK} />
          <p>Policy is valid</p>
        </>
      ) : (
        <>
          <Icon name={ICON_NAMES.EXCLAMATION} />
          <p>Policy is invalid</p>
          <pre>
            <code>{validation.errors}</code>
          </pre>
        </>
      )}
    </div>
  );
};

PolicyValidationResult.propTypes = {
  validation: PropTypes.object,
};

export default PolicyValidationResult;
