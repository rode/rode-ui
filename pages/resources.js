import React, { useState, useEffect } from "react";
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import { useRouter } from "next/router";
import styles from "styles/modules/Resources.module.scss";

const Resources = () => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.query.search) {
      setShowSearchResults(true);
      setCurrentSearch(router.query.search);
    }
  }, [router.query]);

  return (
    <div
      className={
        showSearchResults ? styles.container : styles.containerNoResults
      }
    >
      <ResourceSearchBar currentSearch={currentSearch} />
      {showSearchResults && (
        <>
          <p>search results here</p>
        </>
      )}
    </div>
  );
};

export default Resources;
