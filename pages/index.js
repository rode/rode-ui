import React from "react";
import styles from "styles/modules/Resources.module.scss";
import ResourceSearchBar from "components/resources/ResourceSearchBar";

const Home = () => {
  return (
    <div className={styles.containerNoResults}>
      <ResourceSearchBar />
    </div>
  );
};

export default Home;
