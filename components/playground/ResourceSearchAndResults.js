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
import styles from "styles/modules/Playground.module.scss";
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import Loading from "components/Loading";
import { resourceActions } from "reducers/resources";
import { useResources } from "providers/resources";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import { PLAYGROUND_SEARCH_PAGE_SIZE, SEARCH_ALL } from "utils/constants";
import LabelWithValue from "components/LabelWithValue";
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";
import { buildResourceQueryParams } from "utils/resource-utils";

const ResourceSearchAndResults = ({ genericResource, onResourceSelect }) => {
  const [resourceSearch, setResourceSearch] = useState(!!genericResource);
  const { state, dispatch } = useResources();

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    state.searchTerm ? "/api/resources" : null,
    buildResourceQueryParams(state.searchTerm),
    PLAYGROUND_SEARCH_PAGE_SIZE
  );

  return (
    <>
      <div className={styles.searchContainer}>
        <ResourceSearchBar
          onSubmit={(event) => {
            event.preventDefault();
            setResourceSearch(true);
          }}
          onChange={() => setResourceSearch(false)}
          helpText={
            <Button
              className={styles.viewAllButton}
              buttonType={"text"}
              label={"View all resources"}
              onClick={() => {
                setResourceSearch(true);
                dispatch({
                  type: resourceActions.SET_SEARCH_TERM,
                  data: SEARCH_ALL,
                });
              }}
            />
          }
        />
        {resourceSearch && (
          <Loading loading={loading} type={"button"}>
            {data?.length > 0 ? (
              <>
                {data.map((result) => {
                  const { id, name, type } = result;
                  const isCurrentResource = id === genericResource?.id;

                  return (
                    <div className={`${styles.searchCard}`} key={id}>
                      <div>
                        <p className={styles.cardHeader}>{name}</p>
                        <LabelWithValue
                          label={"Type"}
                          value={type}
                          className={styles.cardText}
                        />
                      </div>
                      <Button
                        onClick={() => {
                          onResourceSelect(result);
                        }}
                        buttonType={"text"}
                        label={
                          isCurrentResource
                            ? "Selected Resource"
                            : "Select Resource"
                        }
                        className={
                          isCurrentResource
                            ? styles.selectedButton
                            : styles.actionButton
                        }
                        disabled={isCurrentResource}
                      >
                        {isCurrentResource && (
                          <>
                            <Icon name={ICON_NAMES.CHECK} />
                            <p>Selected</p>
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
                {!isLastPage && (
                  <Button
                    buttonType={"text"}
                    label={"See More Resources"}
                    onClick={goToNextPage}
                    id={"viewMoreResourcesButton"}
                    className={styles.viewMoreButton}
                  />
                )}
              </>
            ) : (
              <p>{`No resources found matching "${state.searchTerm}"`}</p>
            )}
          </Loading>
        )}
      </div>
    </>
  );
};

ResourceSearchAndResults.propTypes = {
  genericResource: PropTypes.object,
  onResourceSelect: PropTypes.func.isRequired,
};

export default ResourceSearchAndResults;
