import React from "react";
import PropTypes from "prop-types";
import OccurrenceCodeBlock from "./OccurrenceCodeBlock";
import styles from "styles/modules/Occurrences.module.scss";
import BuildOccurrenceDetails from "./BuildOccurrenceDetails";
import VulnerabilityOccurrenceDetails from "./VulnerabilityOccurrenceDetails";
import DeploymentOccurrenceDetails from "./DeploymentOccurrenceDetails";

const detailComponentMap = {
  "BUILD": BuildOccurrenceDetails,
  "VULNERABILITY": VulnerabilityOccurrenceDetails,
  "DISCOVERY": VulnerabilityOccurrenceDetails,
  "DEPLOYMENT": DeploymentOccurrenceDetails
};

const OccurrenceDetails = ({ occurrences }) => {
  const DetailComponent = detailComponentMap[occurrences.originals[0].kind];

  return (
    <div className={styles.detailContainer}>
      <DetailComponent occurrences={occurrences}/>
      <OccurrenceCodeBlock occurrence={occurrences} />
    </div>
  );
};

OccurrenceDetails.propTypes = {
  occurrences: PropTypes.object.isRequired,
};

export default OccurrenceDetails;
