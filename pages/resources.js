/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import { useRouter } from "next/router";
import styles from "styles/modules/Resources.module.scss";
import { useTheme } from "../hooks/useTheme";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const getImageParts = (uri) => {
  return uri.split("@");
};

const Resources = () => {
  const { theme } = useTheme();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentSearch, setCurrentSearch] = useState("");
  const router = useRouter();
  const { data } = useSWR(
    router.query.search
      ? `/api/resources?filter=${encodeURIComponent(router.query.search)}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (router.query.search) {
      setShowSearchResults(true);
      setCurrentSearch(router.query.search);
    }
  }, [router.query]);

  return (
    <div
      className={`${
        showSearchResults ? styles.container : styles.containerNoResults
      } ${styles[theme]}`}
    >
      <ResourceSearchBar currentSearch={currentSearch} />
      {showSearchResults && data && (
        <>
          {data.length > 0 ? (
            data.map(({ uri }) => {
              const [resourceName, version] = getImageParts(uri);

              return (
                <div key={uri} className={styles.searchCard}>
                  <p className={styles.cardHeader}>
                    Resource Name: {resourceName}
                  </p>
                  <p className={styles.cardText}>Version: {version}</p>
                </div>
              );
            })
          ) : (
            <span className={styles.noResults}>No resources found</span>
          )}
        </>
      )}
    </div>
  );
};
export default Resources;
