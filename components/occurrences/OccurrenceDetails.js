import React from "react";
import PropTypes from "prop-types";
import OccurrenceCodeBlock from "./OccurrenceCodeBlock";
import styles from "styles/modules/Occurrences.module.scss";

const OccurrenceDetails = ({ occurrences }) => {
  return (
    <div className={styles.detailContainer}>
      <p>Occurrence Details go here</p>
      <OccurrenceCodeBlock occurrence={occurrences.original} />
    </div>
  );
};

OccurrenceDetails.propTypes = {
  occurrences: PropTypes.object.isRequired,
};

export default OccurrenceDetails;
