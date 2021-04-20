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
import PolicySearchBar from "components/policies/PolicySearchBar";
import { policyActions } from "reducers/policies";
import { usePolicies } from "providers/policies";
import Button from "components/Button";
import { createSearchFilter } from "utils/shared-utils";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";

const PolicySearchAndResults = ({ policy, setPolicy, clearEvaluation }) => {
  const [policySearch, setPolicySearch] = useState(false);

  const { state, dispatch } = usePolicies();

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    policySearch ? "/api/policies" : null,
    createSearchFilter(state.searchTerm),
    1
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
        helpText={
          <Button
            className={styles.viewAllPoliciesButton}
            buttonType={"text"}
            label={"View all policies"}
            onClick={() =>
              dispatch({
                type: policyActions.SET_SEARCH_TERM,
                data: "all",
              })
            }
          />
        }
      />
      <div className={styles.searchResultsContainer}>
        {policySearch && (
          <Loading loading={loading} type={"button"}>
            {data?.length > 0 ? (
              <>
                {data.map((result) => (
                <PlaygroundSearchResult
                  mainText={result.name}
                  subText={result.description}
                  buttonText={"Select Policy"}
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
              ))}
                <Button buttonType="text" onClick={goToNextPage} label={'See More Policies'}/>
              </>
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
