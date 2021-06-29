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

import React, { useState } from "react";
import PropTypes from "prop-types";
import Loading from "components/Loading";
import styles from "styles/modules/PolicyGroupAssignments.module.scss";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import { stateActions } from "reducers/appState";
import {
  DEFAULT_DEBOUNCE_DELAY,
  PLAYGROUND_SEARCH_PAGE_SIZE,
  SEARCH_ALL,
} from "utils/constants";
import PolicySearchBar from "components/policies/PolicySearchBar";
import { useAppState } from "providers/appState";
import useDebouncedValue from "hooks/useDebouncedValue";
import { createSearchFilter } from "utils/shared-utils";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

const PolicySearchAndResults = ({ onAssign, assignedToGroup }) => {
  const [policySearch, setPolicySearch] = useState(false);

  const [debounceDelay, setDebounceDelay] = useState(DEFAULT_DEBOUNCE_DELAY);
  const { state, dispatch } = useAppState();
  const debouncedSearch = useDebouncedValue(
    state.policySearchTerm,
    debounceDelay
  );

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    debouncedSearch ? "/api/policies" : null,
    createSearchFilter(debouncedSearch),
    PLAYGROUND_SEARCH_PAGE_SIZE
  );

  const assignedPolicyVersionIds = assignedToGroup.map(
    ({ policyVersionId }) => policyVersionId
  );

  return (
    <div className={styles.searchContainer}>
      <PolicySearchBar
        onSubmit={(event) => {
          event.preventDefault();
          if (!state.policySearchTerm.length) {
            dispatch({
              type: stateActions.SET_POLICY_SEARCH_TERM,
              data: SEARCH_ALL,
            });
          }
          setPolicySearch(true);
        }}
        onBlur={() => setDebounceDelay(0)}
        onChange={() => {
          setDebounceDelay(DEFAULT_DEBOUNCE_DELAY);
        }}
        helpText={
          <Button
            buttonType={"text"}
            label={"View all policies"}
            onClick={() => {
              dispatch({
                type: stateActions.SET_POLICY_SEARCH_TERM,
                data: SEARCH_ALL,
              });
              setPolicySearch(true);
            }}
            className={styles.viewAllButton}
          />
        }
      />
      <div className={styles.searchResultsContainer}>
        {policySearch && (
          <Loading loading={loading} type={"button"}>
            {data?.length > 0 ? (
              <>
                {data.map((result) => {
                  const isSelected = assignedPolicyVersionIds.some(
                    (versionId) => versionId.includes(result.id)
                  );

                  return (
                    <div className={`${styles.searchCard}`} key={result.id}>
                      <div>
                        <p className={styles.cardHeader}>{result.name}</p>
                        {result.description && (
                          <p className={styles.cardText}>
                            {result.description}
                          </p>
                        )}
                        <p className={styles.cardText}>
                          Latest Version {result.latestVersion}
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          onAssign({
                            ...result,
                            policyName: result.name,
                            policyVersion: result.latestVersion,
                          })
                        }
                        buttonType={"icon"}
                        label={
                          isSelected
                            ? "Assigned to Policy Group"
                            : "Assign to Policy Group"
                        }
                        disabled={isSelected}
                        className={styles.actionButton}
                        showTooltip
                      >
                        {isSelected ? (
                          <>
                            <Icon name={ICON_NAMES.CHECK} size={"large"} />
                          </>
                        ) : (
                          <Icon name={ICON_NAMES.PLUS_CIRCLE} size={"large"} />
                        )}
                      </Button>
                    </div>
                  );
                })}
                {!isLastPage && (
                  <Button
                    buttonType="text"
                    onClick={goToNextPage}
                    label={"See More Policies"}
                    className={styles.viewMoreButton}
                    id={"viewMorePoliciesButton"}
                    loading={loading}
                  />
                )}
              </>
            ) : (
              <p>{`No policies found matching "${state.policySearchTerm}"`}</p>
            )}
          </Loading>
        )}
      </div>
    </div>
  );
};

PolicySearchAndResults.propTypes = {
  onAssign: PropTypes.func.isRequired,
  assignedToGroup: PropTypes.array.isRequired,
};

export default PolicySearchAndResults;
