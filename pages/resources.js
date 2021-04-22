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
import styles from "styles/modules/Search.module.scss";
import { useTheme } from "providers/theme";
import { useResources } from "providers/resources";
import ResourceSearchResult from "components/resources/ResourceSearchResult";
import Loading from "components/Loading";
import { resourceActions } from "reducers/resources";
import Link from "next/link";
import { createSearchFilter } from "utils/shared-utils";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";

// TODO: make constant for search results size, use here and pages/policies

const Resources = () => {
  const { theme } = useTheme();
  const { state, dispatch } = useResources();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    router.query.search ? "/api/resources" : null,
    createSearchFilter(router.query.search),
    3
  );

  const onSubmit = (event) => {
    event.preventDefault();

    if (state.searchTerm.trim().length) {
      router.push(`/resources?search=${state.searchTerm.trim()}`);
    }
  };

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
      className={`
      ${showSearchResults ? styles.showResults : styles.container} 
      ${styles[theme]}`}
    >
      <div className={styles.searchBarContainer}>
        <ResourceSearchBar
          onSubmit={onSubmit}
          helpText={
            <>
              You can search by name, version, or{" "}
              <Link href={"/resources?search=all"}>view all resources</Link>.
            </>
          }
        />
      </div>
      {showSearchResults && (
        <Loading loading={loading}>
          {data?.length > 0 ? (
            <>
              {data.map((result) => {
                return (
                  <ResourceSearchResult
                    key={result.uri}
                    searchResult={result}
                  />
                );
              })}
              {!isLastPage && (
                <Button
                  buttonType="text"
                  onClick={goToNextPage}
                  label={"View More"}
                  className={styles.viewMoreResultsButton}
                />
              )}
            </>
          ) : (
            <span className={styles.noResults}>No resources found</span>
          )}
        </Loading>
      )}
    </div>
  );
};
export default Resources;
