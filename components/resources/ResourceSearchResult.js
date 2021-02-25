import React from "react";
import PropTypes from "prop-types";
import styles from "styles/modules/Resources.module.scss";
import Button from "../Button";
import { useRouter } from "next/router";

const getImageParts = (uri) => {
  return uri.split("@");
};

const ResourceSearchResult = ({ searchResult }) => {
  const [resourceName, version] = getImageParts(searchResult.uri);
  const router = useRouter();

  const onClick = () => {
    console.log('here');
    router.push(`/resources/${searchResult.uri}`)
  }

  return (
    <div className={styles.searchCard}>
      <div>
        <p className={styles.cardHeader}>Resource Name: {resourceName}</p>
        <p className={styles.cardText}>Version: {version}</p>
      </div>
      <Button onClick={onClick} label={'View Details'}/>
    </div>
  );
};

ResourceSearchResult.propTypes = {
  searchResult: PropTypes.object.isRequired
}

export default ResourceSearchResult;
