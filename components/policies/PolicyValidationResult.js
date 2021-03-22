import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Policy.module.scss";

// TODO: improve the styles, add some icons and colors

const PolicyValidationResult = ({validation}) => {

  if (!validation) {
    return null;
  }

  return (
    <div className={styles.validationResults}>
      {
        validation.isValid ?
          <p>Policy is valid</p>
          :
          <>
          <p>Policy is invalid</p>
            <pre><code>{validation.errors}</code></pre>
          </>
      }
    </div>
  )
};

PolicyValidationResult.propTypes = {
  validation: PropTypes.object
}

export default PolicyValidationResult;