import React from "react";
import PropTypes from "prop-types";
import OccurrenceCodeBlock from "./OccurrenceCodeBlock";
import styles from "styles/modules/Occurrences.module.scss";
import BuildOccurrenceDetails from "./BuildOccurrenceDetails";
import VulnerabilityOccurrenceDetails from "./VulnerabilityOccurrenceDetails";
import DeploymentOccurrenceDetails from "./DeploymentOccurrenceDetails";

const detailComponentMap = {
  BUILD: BuildOccurrenceDetails,
  VULNERABILITY: VulnerabilityOccurrenceDetails,
  DISCOVERY: VulnerabilityOccurrenceDetails,
  DEPLOYMENT: DeploymentOccurrenceDetails,
};

const OccurrenceDetails = ({ occurrence }) => {
  const DetailComponent = detailComponentMap[occurrence.originals[0].kind];

  return (
    <div className={styles.detailContainer} data-testid={'occurrenceDetails'}>
      <DetailComponent occurrence={occurrence} />
      <OccurrenceCodeBlock occurrence={occurrence} />
    </div>
  );
};

OccurrenceDetails.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default OccurrenceDetails;
