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
import PolicySearchBar from "components/policies/PolicySearchBar";
import { policyActions } from "reducers/policies";
import { usePolicies } from "providers/policies";
import Button from "components/Button";
import { createSearchFilter } from "utils/shared-utils";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import {
  DEFAULT_DEBOUNCE_DELAY,
  PLAYGROUND_SEARCH_PAGE_SIZE,
  SEARCH_ALL,
} from "utils/constants";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import Drawer from "components/Drawer";
import useDebouncedValue from "hooks/useDebouncedValue";

const PolicySearchAndResults = ({ setPolicy, clearEvaluation }) => {
  const [policySearch, setPolicySearch] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [debounceDelay, setDebounceDelay] = useState(DEFAULT_DEBOUNCE_DELAY);
  const { state, dispatch } = usePolicies();
  const debouncedSearch = useDebouncedValue(
    state.policySearchTerm,
    debounceDelay
  );

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    debouncedSearch ? "/api/policies" : null,
    createSearchFilter(debouncedSearch),
    PLAYGROUND_SEARCH_PAGE_SIZE
  );

  useEffect(() => {
    clearEvaluation();
  }, [policySearch]);

  return (
    <>
      <Button
        label={"Search for policies"}
        buttonType="icon"
        onClick={() => setShowDrawer(true)}
        showTooltip
      >
        <Icon name={ICON_NAMES.SEARCH} />
      </Button>
      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)}>
        <div className={styles.searchContainer}>
          <PolicySearchBar
            onSubmit={(event) => {
              event.preventDefault();
              dispatch({
                type: policyActions.SET_POLICY_SEARCH_TERM,
                data: state.policySearchTerm || SEARCH_ALL,
              });
              setPolicySearch(true);
            }}
            onBlur={() => setDebounceDelay(0)}
            onChange={() => {
              setDebounceDelay(DEFAULT_DEBOUNCE_DELAY);
            }}
            helpText={
              <Button
                className={styles.viewAllButton}
                buttonType={"text"}
                label={"View all policies"}
                onClick={() => {
                  dispatch({
                    type: policyActions.SET_POLICY_SEARCH_TERM,
                    data: SEARCH_ALL,
                  });
                  setPolicySearch(true);
                }}
              />
            }
          />
          {policySearch && (
            <Loading loading={loading} type={"button"}>
              {data?.length > 0 ? (
                <>
                  {data.map((result) => (
                    <div className={`${styles.searchCard}`} key={result.id}>
                      <div>
                        <p className={styles.cardHeader}>{result.name}</p>
                        <p className={styles.cardText}>{result.description}</p>
                      </div>
                      <Button
                        onClick={() => {
                          setPolicy(result);
                          setPolicySearch(false);
                          dispatch({
                            type: policyActions.SET_POLICY_SEARCH_TERM,
                            data: "",
                          });
                          setShowDrawer(false);
                        }}
                        buttonType={"text"}
                        label={"Select Policy"}
                        className={styles.actionButton}
                      />
                    </div>
                  ))}
                  {!isLastPage && (
                    <Button
                      buttonType="text"
                      onClick={goToNextPage}
                      label={"See More Policies"}
                      className={styles.viewMoreButton}
                      id={"viewMorePoliciesButton"}
                    />
                  )}
                </>
              ) : (
                <p>{`No policies found matching "${state.policySearchTerm}"`}</p>
              )}
            </Loading>
          )}
        </div>
      </Drawer>
    </>
  );
};

PolicySearchAndResults.propTypes = {
  setPolicy: PropTypes.func.isRequired,
  clearEvaluation: PropTypes.func.isRequired,
};

export default PolicySearchAndResults;
