import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Occurrences.module.scss";
import { useTheme } from "../../hooks/useTheme";

const DiscoveryOccurrencePreview = ({ occurrence }) => {
  return (
    <>
      <p>Analysis Status: {occurrence.discovered.discovered.analysisStatus}</p>
    </>
  );
};
DiscoveryOccurrencePreview.propTypes = {
  occurrence: PropTypes.object.isRequired
}

const VulnerabilityOccurrencePreview = ({ occurrence }) => {
  return (
    <>
      <p>Type: {occurrence.vulnerability.type}</p>
      <p>Severity: {occurrence.vulnerability.severity}</p>
      <p>Effective Severity: {occurrence.vulnerability.effectiveSeverity}</p>
      {occurrence.vulnerability.shortDescription && (
        <p>Description: {occurrence.vulnerability.shortDescription}</p>
      )}
      <p>
        More details: <a href={occurrence.vulnerability.packageIssue[0].affectedLocation.cpeUri}>{occurrence.vulnerability.packageIssue[0].affectedLocation.cpeUri}</a>
      </p>

      {occurrence.vulnerability.relatedUrls.length > 0 && (
        <>
          <p>Related Urls:</p>
          {occurrence.vulnerability.relatedUrls.map(({ url }, index) => {
            return (
              <a href={url} key={url}>
                {index + 1}
              </a>
            );
          })}
        </>
      )}
    </>
  );
};
VulnerabilityOccurrencePreview.propTypes = {
  occurrence: PropTypes.object.isRequired
}

const occurrenceMap = {
  DISCOVERY: DiscoveryOccurrencePreview,
  VULNERABILITY: VulnerabilityOccurrencePreview,
};

const ResourceOccurrenceCard = ({ occurrence }) => {
  const {theme} = useTheme();
  const OccurrenceDetails = occurrenceMap[occurrence.kind];

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <p>Occurrence Type: {occurrence.kind}</p>
      <p>Created at: {occurrence.createTime}</p>
      <OccurrenceDetails occurrence={occurrence} />
    </div>
  );
};

ResourceOccurrenceCard.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default ResourceOccurrenceCard;
