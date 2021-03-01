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

import React, { useEffect, useState } from "react";
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import { useRouter } from "next/router";
import styles from "styles/modules/Resources.module.scss";
import { useTheme } from "providers/theme";
import { useResources } from "providers/resources";
import ResourceSearchResult from "components/resources/ResourceSearchResult";
import Loading from "components/Loading";
import { useFetch } from "hooks/useFetch";
import { resourceActions } from "../reducers/resources";

const Resources = () => {
  const { theme } = useTheme();
  const { dispatch } = useResources();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const { data, loading } = useFetch(
    router.query.search
      ? `/api/resources?filter=${encodeURIComponent(router.query.search)}`
      : null
  );

  useEffect(() => {
    if (router.query.search) {
      setShowSearchResults(true);
      dispatch({
        type: resourceActions.SET_SEARCH_TERM,
        data: router.query.search,
      });
    } else {
      setShowSearchResults(false);
      dispatch({
        type: resourceActions.SET_SEARCH_TERM,
        data: "",
      });
    }
  }, [router.query]);

  return (
    <div
      className={`${
        showSearchResults ? styles.container : styles.containerNoResults
      } ${styles[theme]}`}
    >
      <ResourceSearchBar />
      {showSearchResults && (
        <>
          {loading && <Loading />}
          {data?.length > 0 ? (
            data.map((result) => {
              return (
                <ResourceSearchResult key={result.uri} searchResult={result} />
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
