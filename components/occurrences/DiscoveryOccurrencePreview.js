import styles from "../../styles/modules/Occurrences.module.scss";
import PropTypes from "prop-types";
import React from "react";

const DiscoveryOccurrencePreview = ({ occurrence }) => {
  return (
    <div className={styles.discovery}>
      <p>Analysis Status: {occurrence.discovered.discovered.analysisStatus}</p>
    </div>
  );
};
DiscoveryOccurrencePreview.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default DiscoveryOccurrencePreview;
