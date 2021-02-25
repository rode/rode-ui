import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Occurrences.module.scss";
import { useTheme } from "hooks/useTheme";
import dayjs from 'dayjs';

const DiscoveryOccurrencePreview = ({ occurrence }) => {
  return (
    <div className={styles.discovery}>
      <p>Analysis Status: {occurrence.discovered.discovered.analysisStatus}</p>
    </div>
  );
};
DiscoveryOccurrencePreview.propTypes = {
  occurrence: PropTypes.object.isRequired
}

const VulnerabilityOccurrencePreview = ({ occurrence }) => {
  return (
    <div className={styles.vulnerability}>
      <p>Package: <a href={occurrence.vulnerability.packageIssue[0].affectedLocation.cpeUri}>{occurrence.vulnerability.packageIssue[0].affectedLocation.package}</a></p>
      <p>Type: {occurrence.vulnerability.type}</p>
      <p>Severity: {occurrence.vulnerability.severity}</p>
      <p>Effective Severity: {occurrence.vulnerability.effectiveSeverity}</p>
      {occurrence.vulnerability.shortDescription && (
        <p>Description: {occurrence.vulnerability.shortDescription}</p>
      )}
      {occurrence.vulnerability.relatedUrls.length > 0 && (
        <>
          <p>Related Urls:
          {occurrence.vulnerability.relatedUrls.map(({ url }, index) => {
            return (
              <a href={url} key={url}>
                {index + 1}
              </a>
            );
          })}
          </p>
        </>
      )}
    </div>
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
      <p className={styles.kind}>{occurrence.kind}</p>
      <p className={styles.createdAt}>Created at {dayjs(occurrence.createTime).format('h:mm:ssa | MM-DD-YYYY')}</p>
      <OccurrenceDetails occurrence={occurrence} />
    </div>
  );
};

ResourceOccurrenceCard.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default ResourceOccurrenceCard;
