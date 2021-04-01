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
import { useFetch } from "hooks/useFetch";
import PolicySearchBar from "components/policies/PolicySearchBar";
import PolicySearchResult from "components/policies/PolicySearchResult";
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";
import { createSearchFilter } from "utils/shared-utils";
import PolicyDashboardButtons from "components/policies/PolicyDashboardButtons";

// TODO: handle flashing of not found on this and resource search page

const Policies = () => {
  const { theme } = useTheme();
  const { state, dispatch } = usePolicies();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const { data, loading } = useFetch(
    router.query.search ? "/api/policies" : null,
    createSearchFilter(router.query.search)
  );

  const onSubmit = (event) => {
    event.preventDefault();

    if (state.searchTerm.trim().length) {
      router.push(`/policies?search=${state.searchTerm.trim()}`);
    }
  };

  useEffect(() => {
    if (router.query.search) {
      setShowSearchResults(true);
      dispatch({
        type: policyActions.SET_SEARCH_TERM,
        data: router.query.search,
      });
    } else {
      setShowSearchResults(false);
      dispatch({
        type: policyActions.SET_SEARCH_TERM,
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
          helpText={
            <>
              You can search by policy name or{" "}
              <Link href={"/policies?search=all"}>view all policies</Link>.
            </>
          }
        />
      </div>
      {showSearchResults ? (
        <Loading loading={loading}>
          {data?.length > 0 ? (
            data.map((result) => {
              return (
                <PolicySearchResult key={result.id} searchResult={result} />
              );
            })
          ) : (
            <span className={styles.noResults}>No policies found</span>
          )}
        </Loading>
      ) : (
        <PolicyDashboardButtons />
      )}
    </div>
  );
};
export default Policies;
