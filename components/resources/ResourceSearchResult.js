import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Resources.module.scss";
import Button from "../Button";

const getImageParts = (uri) => {
  return uri.split("@");
};

const ResourceSearchResult = ({ searchResult }) => {
  const [resourceName, version] = getImageParts(searchResult.uri);

  return (
    <div className={styles.searchCard}>
      <div>
        <p className={styles.cardHeader}>Resource Name: {resourceName}</p>
        <p className={styles.cardText}>Version: {version}</p>
      </div>
      <Button onClick={() => console.log('hi')} label={'View Details'}/>
    </div>
  );
};

ResourceSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired
}

export default ResourceSearchResult;
