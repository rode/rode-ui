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
import ResourceSearchBar from "components/resources/ResourceSearchBar";
import Loading from "components/Loading";
import PlaygroundSearchResult from "./PlaygroundSearchResult";
import { getResourceDetails } from "utils/resource-utils";
import { resourceActions } from "reducers/resources";
import { useResources } from "providers/resources";
import { createSearchFilter } from "utils/shared-utils";
import { usePaginatedFetch } from "hooks/usePaginatedFetch";
import Button from "components/Button";
import { PLAYGROUND_SEARCH_PAGE_SIZE } from "utils/constants";
import ResourceVersion from "components/resources/ResourceVersion";

// TODO: add view all resources button
const ResourceSearchAndResults = ({
  resource,
  setResource,
  clearEvaluation,
}) => {
  const [resourceSearch, setResourceSearch] = useState(false);
  const { state, dispatch } = useResources();

  const { data, loading, isLastPage, goToNextPage } = usePaginatedFetch(
    resourceSearch ? "/api/resources" : null,
    createSearchFilter(state.searchTerm),
    PLAYGROUND_SEARCH_PAGE_SIZE
  );

  useEffect(() => {
    clearEvaluation();
  }, [resourceSearch]);

  return (
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
            onClick={() =>
              dispatch({
                type: resourceActions.SET_SEARCH_TERM,
                data: "all",
              })
            }
          />
        }
      />
      {resourceSearch && (
        <div className={styles.searchResultsContainer}>
          <Loading loading={loading} type={"button"}>
            {data?.length > 0 ? (
              <>
                {data.map((result) => {
                  const {
                    resourceName,
                    resourceVersion,
                    resourceType,
                  } = getResourceDetails(result.uri);

                  return (
                    <PlaygroundSearchResult
                      mainText={resourceName}
                      subText={
                        <>
                          Version: <ResourceVersion version={resourceVersion} />
                        </>
                      }
                      additionalText={`Type: ${resourceType}`}
                      buttonText={"Select Resource"}
                      onClick={() => {
                        setResource({
                          uri: result.uri,
                          name: resourceName,
                          version: resourceVersion,
                          type: resourceType,
                        });
                        setResourceSearch(false);
                        dispatch({
                          type: resourceActions.SET_SEARCH_TERM,
                          data: "",
                        });
                      }}
                      key={result.uri}
                      selected={result.uri === resource?.uri}
                    />
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
        </div>
      )}
    </div>
  );
};

ResourceSearchAndResults.propTypes = {
  resource: PropTypes.object,
  setResource: PropTypes.func.isRequired,
  clearEvaluation: PropTypes.func.isRequired,
};

export default ResourceSearchAndResults;
