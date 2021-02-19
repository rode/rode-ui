import React, { useState, useEffect } from "react";
import useSWR from 'swr'
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import { useRouter } from "next/router";
import styles from "styles/modules/Resources.module.scss";

const Resources = () => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const router = useRouter();
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data } = useSWR(router.query.search ? `/api/resources?filter=${encodeURIComponent(router.query.search)}` : null, fetcher)
  console.log(data)

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
      {(showSearchResults && data) && (
        <>
          {data.map(({name, uri}) => <p>{uri}</p>)}
        </>
      )}
    </div>
  );
};

export default Resources;
