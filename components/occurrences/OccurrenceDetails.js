import React from "react";
import PropTypes from "prop-types";
import OccurrenceCodeBlock from "./OccurrenceCodeBlock";
import styles from "styles/modules/Occurrences.module.scss";
import BuildOccurrenceDetails from "./BuildOccurrenceDetails";
import VulnerabilityOccurrenceDetails from "./VulnerabilityOccurrenceDetails";

const detailComponentMap = {
  "BUILD": BuildOccurrenceDetails,
  "VULNERABILITY": VulnerabilityOccurrenceDetails,
  "DISCOVERY": VulnerabilityOccurrenceDetails,
  "DEPLOYMENT": ""
};

const OccurrenceDetails = ({ occurrences }) => {
  const DetailComponent = detailComponentMap[occurrences.original[0].kind];


  return (
    <div className={styles.detailContainer}>
      <DetailComponent occurrences={occurrences.mapped}/>
      <OccurrenceCodeBlock occurrence={occurrences.original} />
    </div>
  );
};

OccurrenceDetails.propTypes = {
  occurrences: PropTypes.object.isRequired,
};

export default OccurrenceDetails;
