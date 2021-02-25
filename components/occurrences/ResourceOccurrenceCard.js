import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Occurrences.module.scss";
import { useTheme } from "hooks/useTheme";
import dayjs from "dayjs";
import DiscoveryOccurrencePreview from "./DiscoveryOccurrencePreview";
import VulnerabilityOccurrencePreview from "./VulnerabilityOccurrencePreview";

const occurrenceMap = {
  ["DISCOVERY"]: DiscoveryOccurrencePreview,
  ["VULNERABILITY"]: VulnerabilityOccurrencePreview,
};

const ResourceOccurrenceCard = ({ occurrence }) => {
  const { theme } = useTheme();
  const OccurrenceDetails = occurrenceMap[occurrence.kind];

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <p className={styles.kind}>{occurrence.kind}</p>
      <p className={styles.createdAt}>
        {`Created at ${dayjs(occurrence.createTime).format(
          "h:mm:ssa | MM-DD-YYYY"
        )}`}
      </p>
      {OccurrenceDetails && <OccurrenceDetails occurrence={occurrence} />}
    </div>
  );
};

ResourceOccurrenceCard.propTypes = {
  occurrence: PropTypes.object.isRequired,
};

export default ResourceOccurrenceCard;
