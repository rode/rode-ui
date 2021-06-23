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
import ResourceSearchResult from "components/resources/ResourceSearchResult";
import Loading from "components/Loading";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import { DEFAULT_SEARCH_PAGE_SIZE, SEARCH_ALL } from "utils/constants";
import ResourceSearchFilters from "components/resources/ResourceSearchFilters";
import { buildResourceQueryParams } from "utils/resource-utils";
import useDebouncedValue from "hooks/useDebouncedValue";
import { usePolicies } from "providers/appState";
import { policyActions } from "reducers/policies";

const Resources = () => {
  const { theme } = useTheme();
  const { state, dispatch } = usePolicies();
  const debouncedSearch = useDebouncedValue(state.resourceSearchTerm);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    debouncedSearch ? "/api/resources" : null,
    buildResourceQueryParams(debouncedSearch, state.resourceTypeSearchFilter),
    DEFAULT_SEARCH_PAGE_SIZE
  );

  const onSubmit = (event) => {
    event.preventDefault();

    if (state.resourceSearchTerm.trim().length) {
      router.push(`/resources?search=${state.resourceSearchTerm.trim()}`);
    } else {
      router.push(`/resources?search=${SEARCH_ALL}`);
    }
  };

  const viewAllResources = () => {
    dispatch({
      type: policyActions.SET_RESOURCE_TYPE_SEARCH_FILTER,
      data: [],
    });
    router.push(`/resources?search=${SEARCH_ALL}`);
  };

  useEffect(() => {
    dispatch({
      type: policyActions.SET_RESOURCE_TYPE_SEARCH_FILTER,
      data: [],
    });
  }, []);

  useEffect(() => {
    if (router.query.search) {
      setShowSearchResults(true);
      dispatch({
        type: policyActions.SET_RESOURCE_SEARCH_TERM,
        data: router.query.search,
      });
    } else {
      setShowSearchResults(false);
      dispatch({
        type: policyActions.SET_RESOURCE_SEARCH_TERM,
        data: SEARCH_ALL,
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
          onBlur={onSubmit}
          helpText={
            <>
              You can search by name or{" "}
              <button
                type={"button"}
                onClick={viewAllResources}
                className={styles.viewAllButton}
              >
                view all resources
              </button>
              .
            </>
          }
        />
        {showSearchResults && <ResourceSearchFilters />}
      </div>
      {showSearchResults && (
        <>
          <Loading loading={loading}>
            {data?.length > 0 ? (
              <>
                {data.map((result) => {
                  return (
                    <ResourceSearchResult
                      key={result.id}
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
        </>
      )}
    </div>
  );
};
export default Resources;
