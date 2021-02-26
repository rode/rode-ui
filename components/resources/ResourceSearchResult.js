import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Resources.module.scss";
import Button from "components/Button";
import { useRouter } from "next/router";
import { getResourceDetails } from "utils/resource-utils";

const ResourceSearchResult = ({ searchResult }) => {
  const { resourceName, resourceVersion } = getResourceDetails(
    searchResult.uri
  );
  const router = useRouter();

  const onClick = () => {
    router.push(`/resources/${encodeURIComponent(searchResult.uri)}`);
  };

  return (
    <div className={styles.searchCard}>
      <div>
        <p className={styles.cardHeader}>{`Resource Name: ${resourceName}`}</p>
        <p className={styles.cardText}>{`Version: ${resourceVersion}`}</p>
      </div>
      <Button onClick={onClick} label={"View Details"} />
    </div>
  );
};

ResourceSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired,
};

export default ResourceSearchResult;
