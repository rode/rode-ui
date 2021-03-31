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
import PropTypes from "prop-types";
import styles from "styles/modules/Playground.module.scss";
import Loading from "components/Loading";
import PlaygroundSearchResult from "./PlaygroundSearchResult";
import { useFetch } from "hooks/useFetch";
import PolicySearchBar from "components/policies/PolicySearchBar";
import { policyActions } from "reducers/policies";
import { usePolicies } from "providers/policies";

// TODO: tests

const PolicySearchAndResults = ({ policy, setPolicy, clearEvaluation }) => {
  const [policySearch, setPolicySearch] = useState(false);

  const { state, dispatch } = usePolicies();

  const { data: policyResults, loading: policyLoading } = useFetch(
    policySearch ? "/api/policies" : null,
    {
      filter: state.searchTerm,
    }
  );

  useEffect(() => {
    clearEvaluation();
  }, [policySearch]);

  return (
    <div className={styles.searchContainer}>
      <PolicySearchBar
        onSubmit={(event) => {
          event.preventDefault();
          setPolicySearch(true);
        }}
        onChange={() => setPolicySearch(false)}
      />
      <div className={styles.searchResultsContainer}>
        {policySearch && (
          <Loading loading={policyLoading} type={"button"}>
            {policyResults?.length > 0 ? (
              policyResults.map((result) => (
                <PlaygroundSearchResult
                  searchResult={result}
                  type={"policy"}
                  onClick={() => {
                    setPolicy(result);
                    setPolicySearch(false);
                    dispatch({
                      type: policyActions.SET_SEARCH_TERM,
                      data: "",
                    });
                  }}
                  key={result.id}
                  selected={result.id === policy?.id}
                />
              ))
            ) : (
              <p>{`No policies found matching "${state.searchTerm}"`}</p>
            )}
          </Loading>
        )}
      </div>
    </div>
  );
};

PolicySearchAndResults.propTypes = {
  policy: PropTypes.object,
  setPolicy: PropTypes.func.isRequired,
  clearEvaluation: PropTypes.func.isRequired,
};

export default PolicySearchAndResults;
