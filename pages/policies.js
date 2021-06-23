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
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "styles/modules/Search.module.scss";
import { useTheme } from "providers/theme";
import Loading from "components/Loading";
import PolicySearchBar from "components/policies/PolicySearchBar";
import PolicySearchResult from "components/policies/PolicySearchResult";
import { useAppState } from "providers/appState";
import { policyActions } from "reducers/policies";
import { createSearchFilter } from "utils/shared-utils";
import Button from "components/Button";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import { DEFAULT_SEARCH_PAGE_SIZE, SEARCH_ALL } from "utils/constants";
import useDebouncedValue from "hooks/useDebouncedValue";

const Policies = () => {
  const { theme } = useTheme();
  const { state, dispatch } = useAppState();
  const debouncedSearch = useDebouncedValue(state.policySearchTerm);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    debouncedSearch ? "/api/policies" : null,
    createSearchFilter(debouncedSearch),
    DEFAULT_SEARCH_PAGE_SIZE
  );

  const onSubmit = (event) => {
    event.preventDefault();

    if (state.policySearchTerm.trim().length) {
      router.push(`/policies?search=${state.policySearchTerm.trim()}`);
    } else {
      router.push(`/policies?search=${SEARCH_ALL}`);
    }
  };

  useEffect(() => {
    if (router.query.search) {
      setShowSearchResults(true);
      dispatch({
        type: policyActions.SET_POLICY_SEARCH_TERM,
        data: router.query.search,
      });
    } else {
      setShowSearchResults(false);
      dispatch({
        type: policyActions.SET_POLICY_SEARCH_TERM,
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
        <PolicySearchBar
          onSubmit={onSubmit}
          onBlur={onSubmit}
          helpText={
            <>
              You can search by policy name or{" "}
              <Link href={`/policies?search=${SEARCH_ALL}`}>
                view all policies
              </Link>
              .
            </>
          }
        />
      </div>
      {showSearchResults ? (
        <Loading loading={loading}>
          {data?.length > 0 ? (
            <>
              {data.map((result) => {
                return (
                  <PolicySearchResult key={result.id} searchResult={result} />
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
            <span className={styles.noResults}>No policies found</span>
          )}
        </Loading>
      ) : null}
    </div>
  );
};
export default Policies;
